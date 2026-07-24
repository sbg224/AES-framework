#!/usr/bin/env node
"use strict";

/**
 * Installateur AES : analyse (dry-run) et application dans un projet cible.
 *
 * Usage :
 *   node install/installer.js analyze <chemin_projet>
 *   node install/installer.js apply   <chemin_projet> [--allow-no-git] [--allow-dirty]
 *
 * Modules natifs Node uniquement, aucune dépendance ajoutée.
 * La commande 'analyze' ne modifie jamais rien et fonctionne même sans git.
 * La commande 'apply' écrit réellement les fichiers, avec des préconditions
 * git par défaut (voir install/README.md).
 */

const fs = require("fs");
const path = require("path");
const { gitState, writeAtomic, globalState } = require("./lib/core.js");

// Racine du dépôt AES, calculée depuis l'emplacement réel de CE fichier
// (__dirname), jamais depuis le dossier où la commande est lancée (cwd).
// C'est ce qui rend l'installateur invocable indifféremment depuis la racine
// du dépôt AES ou depuis celle du projet cible (voir install/README.md §3),
// et ce qui le rendra compatible avec une exécution via npx le jour venu.
const REPO_ROOT = path.resolve(__dirname, "..");
// Le manifeste est la seule source de vérité listant les 14 fichiers du
// socle "ia/" à installer, leur statut de protection et leur emplacement
// source dans le dépôt AES (voir install/README.md §10).
const MANIFEST_PATH = path.join(REPO_ROOT, "install", "installation.manifest.json");

// Registre des intégrations d'agents disponibles. Chaque entrée est un
// module indépendant (voir install/integrations/), avec son propre
// manifeste, jamais mêlé à celui du socle "ia/" (voir AES-D012,
// DECISIONS.md). Pour ajouter un nouvel agent, il suffit d'ajouter une
// entrée ici : le reste du CLI (cmdIntegrationAnalyze/cmdIntegrationApply)
// est déjà générique.
const INTEGRATIONS = {
  "claude-code": require("./integrations/claude_code.js"),
};

// Préfixes de ligne qui portent un numéro de version dans un document.
// Utilisés par normalizeContent() ci-dessous pour ignorer ces lignes lors
// d'une comparaison de contenu, voir le commentaire de cette fonction.
const VERSION_LINE_PREFIXES = [
  "Structure : issue d'AES v",
  "Structure : issue d’AES v",
  "Version : ",
];

// Lit et parse le manifeste du socle depuis le disque à chaque appel
// (plutôt que de le mettre en cache), pour toujours refléter son état
// réel sur le disque au moment de l'exécution.
function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

/**
 * Retire les lignes de version pour comparer le contenu réel, pas le numéro
 * de version, qui diverge légitimement entre le dépôt AES et un projet
 * installé (voir SYSTEM.md §7, un fait historique, pas une obligation de
 * mise à jour).
 */
function normalizeContent(texte) {
  return texte
    .split("\n")
    .filter((ligne) => !VERSION_LINE_PREFIXES.some((prefix) => ligne.startsWith(prefix)))
    .join("\n");
}

// Détermine ce qu'il faut faire pour UN fichier du socle donné (entry),
// en comparant la source dans le dépôt AES au fichier déjà présent (ou non)
// dans le projet cible. Ne lit jamais que le disque, n'écrit jamais rien :
// c'est la fonction de classification pure, utilisée aussi bien par
// 'analyze' (lecture seule) que par 'apply' (qui classe avant d'écrire).
//
// Les actions possibles, du moins au plus grave :
//   CREATE   : le fichier sera créé (absent du projet cible).
//   SKIP     : rien à faire (déjà conforme, ou document "vivant" jamais
//              remplacé automatiquement quel que soit son contenu).
//   REVIEW   : le fichier diffère du gabarit, mais son statut "reference"
//              ne permet jamais un remplacement automatique, une revue
//              humaine est proposée.
//   CONFLICT : le fichier diffère du gabarit et son statut "gouvernance"
//              bloque toute l'installation tant que ce n'est pas résolu.
//   ERROR    : la source elle-même est introuvable dans le dépôt AES, ou
//              le statut déclaré dans le manifeste est inconnu.
function classifyFile(entry, iaDir) {
  const sourcePath = path.join(REPO_ROOT, entry.source);
  const targetPath = path.join(iaDir, entry.nom);

  if (!fs.existsSync(sourcePath)) {
    return { nom: entry.nom, statut: entry.statut, action: "ERROR", detail: `source introuvable : ${entry.source}` };
  }

  if (!fs.existsSync(targetPath)) {
    return { nom: entry.nom, statut: entry.statut, action: "CREATE", detail: "absent du projet cible" };
  }

  let sourceTexte, cibleTexte;
  try {
    sourceTexte = normalizeContent(fs.readFileSync(sourcePath, "utf8"));
    cibleTexte = normalizeContent(fs.readFileSync(targetPath, "utf8"));
  } catch (exc) {
    return { nom: entry.nom, statut: entry.statut, action: "ERROR", detail: `lecture impossible : ${exc.message}` };
  }

  if (entry.statut === "vivant") {
    // Jamais remplacé automatiquement, présent ou non, identique ou non.
    return { nom: entry.nom, statut: entry.statut, action: "SKIP", detail: "document vivant déjà présent, jamais remplacé" };
  }

  if (sourceTexte === cibleTexte) {
    return { nom: entry.nom, statut: entry.statut, action: "SKIP", detail: "déjà conforme" };
  }

  if (entry.statut === "reference") {
    return { nom: entry.nom, statut: entry.statut, action: "REVIEW", detail: "diffère du gabarit actuel, proposition seulement" };
  }

  if (entry.statut === "gouvernance") {
    return { nom: entry.nom, statut: entry.statut, action: "CONFLICT", detail: "diffère du gabarit actuel, processus de validation explicite requis" };
  }

  return { nom: entry.nom, statut: entry.statut, action: "ERROR", detail: `statut inconnu : ${entry.statut}` };
}

// Classe les 14 fichiers du manifeste pour un projet cible donné. Toujours
// sûre (aucune écriture), c'est la fonction utilisée aussi bien par la
// commande 'analyze' seule que comme étape préalable avant tout 'apply'.
function analyze(cibleDir) {
  const manifest = loadManifest();
  const iaDir = path.join(cibleDir, manifest.destination_racine);
  return manifest.fichiers.map((entry) => classifyFile(entry, iaDir));
}

// Affiche le tableau des opérations (une ligne par fichier/artefact, avec
// son action et son détail), aligné en colonnes, suivi de l'état global
// agrégé (OK / COMPLETED_WITH_REVIEW / BLOCKED_BY_CONFLICT / ERROR).
// Utilisé aussi bien pour un rapport d'analyse que pour le plan affiché
// juste avant l'écriture réelle lors d'un 'apply'.
function printReport(operations, mode) {
  const largeur = Math.max(...operations.map((op) => op.nom.length));
  for (const op of operations) {
    console.log(`  ${op.action.padEnd(9)} ${op.nom.padEnd(largeur)}  ${op.detail}`);
  }
  console.log();
  console.log(`État global (${mode}) : ${globalState(operations)}`);
}

// Implémente 'node install/installer.js analyze <chemin_projet>'.
// Ne touche jamais au disque du projet cible, ignore volontairement l'état
// git (aucune précondition à vérifier puisque rien n'est écrit).
function cmdAnalyze(args) {
  const cibleDir = path.resolve(args.cheminProjet);
  const operations = analyze(cibleDir);
  console.log(`Analyse de ${cibleDir} (aucune écriture, git ignoré) :\n`);
  printReport(operations, "analyse");
  return 0;
}

// Implémente 'node install/installer.js apply <chemin_projet>'.
// Contrairement à cmdAnalyze, celle-ci écrit réellement sur le disque, donc
// elle vérifie d'abord les préconditions git (sauf drapeaux explicites),
// puis réanalyse systématiquement avant d'écrire (pour ne jamais agir sur
// un état supposé plutôt que sur l'état réel du projet au moment T),
// et enfin n'écrit que les fichiers classés CREATE, jamais les autres.
function cmdApply(args) {
  const cibleDir = path.resolve(args.cheminProjet);

  // Précondition 1 : un dépôt git doit exister, sauf si l'utilisateur a
  // explicitement accepté de s'en passer (--allow-no-git). Sans git, il
  // devient difficile d'annuler facilement les modifications de l'installateur.
  const git = gitState(cibleDir);
  if (git === "absent" && !args.allowNoGit) {
    console.error("Refus : aucun dépôt git détecté. Utiliser --allow-no-git pour passer outre explicitement.");
    return 1;
  }
  // Précondition 2 : l'arbre de travail doit être propre, sauf si
  // l'utilisateur a explicitement accepté le risque (--allow-dirty), pour
  // ne jamais mélanger les écritures de l'installateur avec des
  // modifications locales non enregistrées.
  if (git === "sale" && !args.allowDirty) {
    console.error("Refus : arbre git non propre. Committer, stasher, ou utiliser --allow-dirty pour passer outre explicitement.");
    return 1;
  }

  const manifest = loadManifest();
  const iaDir = path.join(cibleDir, manifest.destination_racine);
  // Réanalyse juste avant d'écrire : garantit que le plan affiché
  // correspond exactement à ce qui sera réellement appliqué.
  const operations = analyze(cibleDir);

  console.log(`Plan pour ${cibleDir} :\n`);
  printReport(operations, "plan avant écriture");
  console.log();

  // Un seul CONFLICT ou ERROR sur les 14 fichiers bloque l'écriture de
  // TOUS les fichiers, y compris ceux qui seraient par ailleurs valides,
  // pour éviter une installation partielle silencieuse.
  const etat = globalState(operations);
  if (etat === "ERROR" || etat === "BLOCKED_BY_CONFLICT") {
    console.error(`Application refusée : état global ${etat}. Aucun fichier écrit.`);
    return 1;
  }

  const ecrits = [];
  try {
    // N'écrit que les opérations classées CREATE : les SKIP et REVIEW ne
    // sont jamais touchés (voir classifyFile ci-dessus, c'est là que
    // se joue la protection contre l'écrasement).
    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const entry = manifest.fichiers[i];
      if (op.action !== "CREATE") continue;
      const sourcePath = path.join(REPO_ROOT, entry.source);
      const targetPath = path.join(iaDir, entry.nom);
      writeAtomic(targetPath, fs.readFileSync(sourcePath, "utf8"));
      ecrits.push(entry.nom);
    }
  } catch (exc) {
    // Une interruption en cours d'écriture (ex. coupure) laisse les
    // fichiers déjà écrits en l'état : writeAtomic garantit qu'AUCUN
    // fichier individuel n'est corrompu, seule l'installation globale
    // peut rester incomplète (voir install/README.md §12).
    console.error(`Échec en cours d'écriture : ${exc.message}`);
    console.error(`Fichiers déjà écrits avant l'échec : ${ecrits.length ? ecrits.join(", ") : "aucun"}`);
    return 1;
  }

  console.log(`Fichiers créés : ${ecrits.length ? ecrits.join(", ") : "aucun"}`);
  console.log(`État final : ${etat}`);
  return 0;
}

// Implémente 'node install/installer.js integration analyze <agent> <chemin_projet>'.
// Délègue toute la logique à l'intégration correspondante (INTEGRATIONS
// ci-dessus) : ce fichier ne connaît rien des artefacts propres à un agent
// précis, uniquement comment appeler son module.
function cmdIntegrationAnalyze(args) {
  const integration = INTEGRATIONS[args.agent];
  if (!integration) {
    console.error(`Intégration inconnue : ${args.agent}. Intégrations disponibles : ${Object.keys(INTEGRATIONS).join(", ")}.`);
    return 1;
  }
  const cibleDir = path.resolve(args.cheminProjet);
  const operations = integration.analyze(cibleDir, REPO_ROOT);
  console.log(`Analyse de l'intégration '${args.agent}' pour ${cibleDir} (aucune écriture, git ignoré) :\n`);
  printReport(operations, "analyse");
  return 0;
}

// Implémente 'node install/installer.js integration apply <agent> <chemin_projet>'.
// Même structure que cmdApply ci-dessus (préconditions git, réanalyse avant
// écriture, blocage total si ERROR/CONFLICT), mais l'écriture elle-même est
// déléguée à integration.apply(), propre à chaque agent (copie de fichier,
// fusion JSON additive, fusion Markdown par marqueurs, voir claude_code.js).
function cmdIntegrationApply(args) {
  const integration = INTEGRATIONS[args.agent];
  if (!integration) {
    console.error(`Intégration inconnue : ${args.agent}. Intégrations disponibles : ${Object.keys(INTEGRATIONS).join(", ")}.`);
    return 1;
  }

  const cibleDir = path.resolve(args.cheminProjet);

  const git = gitState(cibleDir);
  if (git === "absent" && !args.allowNoGit) {
    console.error("Refus : aucun dépôt git détecté. Utiliser --allow-no-git pour passer outre explicitement.");
    return 1;
  }
  if (git === "sale" && !args.allowDirty) {
    console.error("Refus : arbre git non propre. Committer, stasher, ou utiliser --allow-dirty pour passer outre explicitement.");
    return 1;
  }

  const operations = integration.analyze(cibleDir, REPO_ROOT);

  console.log(`Plan pour l'intégration '${args.agent}' sur ${cibleDir} :\n`);
  printReport(operations, "plan avant écriture");
  console.log();

  const etat = globalState(operations);
  if (etat === "ERROR" || etat === "BLOCKED_BY_CONFLICT") {
    console.error(`Application refusée : état global ${etat}. Aucun fichier écrit.`);
    return 1;
  }

  let ecrits;
  try {
    // operations vient d'être calculé juste au-dessus par le même appel à
    // integration.analyze() : l'intégration peut donc s'appuyer sur la
    // correspondance par position entre operations[i] et son propre
    // manifeste (voir claude_code.js apply()).
    ecrits = integration.apply(cibleDir, REPO_ROOT, operations);
  } catch (exc) {
    console.error(`Échec en cours d'écriture : ${exc.message}`);
    return 1;
  }

  console.log(`Fichiers créés/fusionnés : ${ecrits.length ? ecrits.join(", ") : "aucun"}`);
  console.log(`État final : ${etat}`);
  return 0;
}

// Point d'entrée du CLI : découpe argv et redirige vers la bonne commande.
// Deux familles de commandes coexistent :
//   - le socle "ia/"        : aes-framework <analyze|apply> <projet>
//   - une intégration agent : aes-framework integration <analyze|apply> <agent> <projet>
// Invocable soit via la commande publiée `aes-framework` (voir le champ
// "bin" de package.json), soit directement depuis une copie du dépôt via
// `node install/installer.js ...` — les deux formes sont strictement
// équivalentes, seuls les messages d'usage ci-dessous montrent la première.
// Retourne toujours un code numérique (0 = succès, 1 = refus/erreur),
// jamais d'exception non gérée, pour que le code de sortie du process
// (voir process.exit ci-dessous) soit toujours prévisible depuis un script
// appelant ou une CI.
function main(argv) {
  const [commande, ...reste0] = argv;

  if (commande === "integration") {
    const [verbe, agent, cheminProjet, ...reste] = reste0;
    if (!verbe || !agent || !cheminProjet) {
      console.error(
        [
          "Usage :",
          "  aes-framework integration analyze claude-code <chemin-projet> [--allow-no-git] [--allow-dirty]",
          "  aes-framework integration apply   claude-code <chemin-projet> [--allow-no-git] [--allow-dirty]",
        ].join("\n")
      );
      return 1;
    }
    const args = {
      agent,
      cheminProjet,
      allowNoGit: reste.includes("--allow-no-git"),
      allowDirty: reste.includes("--allow-dirty"),
    };
    if (verbe === "analyze") return cmdIntegrationAnalyze(args);
    if (verbe === "apply") return cmdIntegrationApply(args);
    console.error(`Commande inconnue : integration ${verbe}`);
    return 1;
  }

  const [cheminProjet, ...reste] = reste0;
  if (!commande || !cheminProjet) {
    console.error(
      [
        "Usage :",
        "  aes-framework analyze <chemin-projet> [--allow-no-git] [--allow-dirty]",
        "  aes-framework apply   <chemin-projet> [--allow-no-git] [--allow-dirty]",
        "  aes-framework integration analyze claude-code <chemin-projet> [--allow-no-git] [--allow-dirty]",
        "  aes-framework integration apply   claude-code <chemin-projet> [--allow-no-git] [--allow-dirty]",
      ].join("\n")
    );
    return 1;
  }

  const args = {
    cheminProjet,
    allowNoGit: reste.includes("--allow-no-git"),
    allowDirty: reste.includes("--allow-dirty"),
  };

  if (commande === "analyze") return cmdAnalyze(args);
  if (commande === "apply") return cmdApply(args);

  console.error(`Commande inconnue : ${commande}`);
  return 1;
}

// N'exécute main() que si ce fichier est lancé directement en CLI
// (`node install/installer.js ...`), jamais quand il est simplement
// require()-ié, par exemple depuis les fichiers de tests
// (install/tests/*.js), qui importent les fonctions ci-dessous sans
// vouloir déclencher tout un process.exit().
if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

// Exports utilisés par les suites de tests (install/tests/) pour appeler
// directement la logique interne (classifyFile, analyze, cmdApply, ...)
// sans passer par un sous-processus, et par install/integrations/claude_code.js
// et d'autres futurs modules d'intégration pour réutiliser REPO_ROOT et les
// garanties transverses réexportées depuis lib/core.js (gitState, writeAtomic).
module.exports = {
  REPO_ROOT,
  INTEGRATIONS,
  loadManifest,
  normalizeContent,
  classifyFile,
  analyze,
  globalState,
  printReport,
  gitState,
  writeAtomic,
  cmdAnalyze,
  cmdApply,
  cmdIntegrationAnalyze,
  cmdIntegrationApply,
  main,
};
