"use strict";

/**
 * Intégration Claude Code : skill, script de hook, fusion additive dans
 * .claude/settings.json et dans CLAUDE.md.
 *
 * Isolée du socle ia/ (voir AES-D012, DECISIONS.md). Ne réimplémente pas les
 * garanties transverses (git, écriture atomique, vocabulaire de statuts),
 * réutilisées depuis install/installer.js.
 */

const fs = require("fs");
const path = require("path");
const { writeAtomic } = require("../lib/core.js");

// Le manifeste propre à Claude Code, distinct de celui du socle ia/ (voir
// AES-D012) : il décrit les 4 artefacts de cette intégration (skill, script
// de hook, entrée de hook dans settings.json, bloc dans CLAUDE.md), chacun
// avec un champ "type" qui indique COMMENT le traiter (copie, fusion_json,
// fusion_markdown), pas seulement où il va.
const MANIFEST_PATH = path.join(__dirname, "claude_code.manifest.json");

// Lit et parse ce manifeste depuis le disque à chaque appel, pour toujours
// refléter son état réel au moment de l'exécution (même logique que
// installer.js loadManifest()).
function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

/**
 * Égalité profonde de deux valeurs JSON (objets, tableaux, primitives),
 * sans dépendance externe. Utilisée pour comparer une entrée de hook déjà
 * présente dans .claude/settings.json à l'entrée attendue par AES, afin de
 * décider si elle est déjà conforme (SKIP) ou si elle diffère (REVIEW).
 *
 * Les clés d'objet sont triées avant comparaison, donc l'ordre des clés
 * dans le JSON n'a pas d'importance ; l'ordre des éléments dans un tableau,
 * lui, compte (deux tableaux avec les mêmes éléments dans un ordre
 * différent sont considérés différents).
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  const clesA = Object.keys(a).sort();
  const clesB = Object.keys(b).sort();
  if (clesA.length !== clesB.length) return false;
  return clesA.every((cle, i) => cle === clesB[i] && deepEqual(a[cle], b[cle]));
}

// Classe un artefact de type "copie" (SKILL.md ou aes-reminder.sh) : un
// simple fichier source du dépôt AES à copier tel quel vers une destination
// dans le projet cible. Ne compare jamais le statut "gouvernance"/"vivant"
// ici : ce périmètre n'utilise que le statut "reference" (voir le
// commentaire dans classifyCopie plus bas et AES-D012).
function classifyCopie(entry, repoRoot, cibleDir) {
  const sourcePath = path.join(repoRoot, entry.source);
  const targetPath = path.join(cibleDir, entry.destination);

  if (!fs.existsSync(sourcePath)) {
    return { nom: entry.nom, action: "ERROR", detail: `source introuvable : ${entry.source}` };
  }
  if (!fs.existsSync(targetPath)) {
    return { nom: entry.nom, action: "CREATE", detail: "absent du projet cible" };
  }

  let sourceTexte, cibleTexte;
  try {
    sourceTexte = fs.readFileSync(sourcePath, "utf8");
    cibleTexte = fs.readFileSync(targetPath, "utf8");
  } catch (exc) {
    return { nom: entry.nom, action: "ERROR", detail: `lecture impossible : ${exc.message}` };
  }

  if (sourceTexte === cibleTexte) {
    return { nom: entry.nom, action: "SKIP", detail: "déjà conforme" };
  }

  // Statut référence uniquement dans ce périmètre : REVIEW, jamais CONFLICT.
  return { nom: entry.nom, action: "REVIEW", detail: "diffère du gabarit actuel, proposition seulement" };
}

// Cherche, parmi les blocs de hooks déjà présents dans .claude/settings.json
// pour un événement donné (ex. "UserPromptSubmit"), celui qui a été posé
// par AES lors d'une installation précédente. L'identification se fait par
// la VALEUR d'un champ précis (entry.identifiant / entry.valeur_identifiante
// dans le manifeste, ex. le champ "command" avec le chemin exact du script
// AES), jamais par position dans le tableau : ça permet de retrouver le
// bloc AES même si l'utilisateur a ajouté d'autres hooks avant ou après.
function trouverBlocAES(blocs, identifiant, valeur) {
  for (const bloc of blocs) {
    if (bloc && Array.isArray(bloc.hooks)) {
      for (const h of bloc.hooks) {
        if (h && h[identifiant] === valeur) return bloc;
      }
    }
  }
  return null;
}

// Classe un artefact de type "fusion_json" (aujourd'hui : l'entrée de hook
// UserPromptSubmit dans .claude/settings.json). Contrairement à une copie,
// il ne s'agit jamais de remplacer le fichier entier : seule une entrée
// précise, identifiée par trouverBlocAES ci-dessus, est comparée et
// éventuellement ajoutée. Toute autre configuration déjà présente dans
// .claude/settings.json (permissions, autres hooks) n'est jamais touchée.
function classifyFusionJson(entry, cibleDir) {
  const targetPath = path.join(cibleDir, entry.destination);

  if (!fs.existsSync(targetPath)) {
    return { nom: entry.nom, action: "CREATE", detail: "fichier absent, sera créé" };
  }

  let texte;
  try {
    texte = fs.readFileSync(targetPath, "utf8");
  } catch (exc) {
    return { nom: entry.nom, action: "ERROR", detail: `lecture impossible : ${exc.message}` };
  }

  let racine;
  try {
    racine = JSON.parse(texte);
  } catch (exc) {
    // Un settings.json invalide bloque tout, plutôt que de tenter une
    // réparation risquée d'un fichier de configuration appartenant en
    // partie à l'utilisateur.
    return { nom: entry.nom, action: "ERROR", detail: `JSON invalide : ${exc.message}` };
  }

  if (typeof racine !== "object" || racine === null || Array.isArray(racine)) {
    return { nom: entry.nom, action: "ERROR", detail: "structure racine inattendue, doit être un objet" };
  }

  if (!("hooks" in racine)) {
    return { nom: entry.nom, action: "CREATE", detail: "clé 'hooks' absente, sera ajoutée" };
  }

  const hooks = racine.hooks;
  if (typeof hooks !== "object" || hooks === null || Array.isArray(hooks)) {
    return { nom: entry.nom, action: "ERROR", detail: "clé 'hooks' présente mais n'est pas un objet" };
  }

  // entry.cle = ["hooks", "UserPromptSubmit"] dans le manifeste : cleEvenement
  // est donc "UserPromptSubmit", le nom de l'événement Claude Code concerné.
  const cleEvenement = entry.cle[1];
  if (!(cleEvenement in hooks)) {
    return { nom: entry.nom, action: "CREATE", detail: `clé '${cleEvenement}' absente, sera ajoutée` };
  }

  const blocs = hooks[cleEvenement];
  if (!Array.isArray(blocs)) {
    return { nom: entry.nom, action: "ERROR", detail: `'${cleEvenement}' présente mais n'est pas un tableau` };
  }

  const trouve = trouverBlocAES(blocs, entry.identifiant, entry.valeur_identifiante);
  if (!trouve) {
    return { nom: entry.nom, action: "CREATE", detail: "entrée AES absente, sera ajoutée au tableau existant" };
  }

  if (deepEqual(trouve, entry.entree)) {
    return { nom: entry.nom, action: "SKIP", detail: "entrée AES déjà conforme" };
  }

  return { nom: entry.nom, action: "REVIEW", detail: "entrée AES présente mais différente, proposition seulement" };
}

// Applique réellement la fusion JSON classée CREATE par classifyFusionJson
// ci-dessus : ajoute l'entrée AES au tableau existant (ou crée la structure
// hooks/événement si elle n'existait pas), sans jamais toucher au reste du
// fichier. writeAtomic (voir lib/core.js) garantit qu'aucune écriture
// partielle n'est possible même en cas d'interruption.
function appliquerFusionJson(entry, cibleDir) {
  const targetPath = path.join(cibleDir, entry.destination);
  let racine = {};
  if (fs.existsSync(targetPath)) {
    racine = JSON.parse(fs.readFileSync(targetPath, "utf8"));
  }
  if (typeof racine.hooks !== "object" || racine.hooks === null || Array.isArray(racine.hooks)) {
    racine.hooks = {};
  }
  const cleEvenement = entry.cle[1];
  if (!Array.isArray(racine.hooks[cleEvenement])) {
    racine.hooks[cleEvenement] = [];
  }
  racine.hooks[cleEvenement].push(entry.entree);
  writeAtomic(targetPath, JSON.stringify(racine, null, 2) + "\n");
}

// Classe l'artefact de type "fusion_markdown" (le bloc socle dans
// CLAUDE.md, délimité par les marqueurs <!-- AES:SOCLE:BEGIN/END -->).
// Comme pour la fusion JSON, seul le contenu entre les deux marqueurs
// appartient à AES : tout le reste de CLAUDE.md (contenu personnalisé du
// développeur, mise en forme, ordre des sections) est préservé à
// l'identique, avant comme après une installation ou une réapplication.
function classifyFusionMarkdown(entry, cibleDir) {
  const targetPath = path.join(cibleDir, entry.destination);

  if (!fs.existsSync(targetPath)) {
    return { nom: entry.nom, action: "CREATE", detail: "fichier absent, sera créé" };
  }

  let texte;
  try {
    texte = fs.readFileSync(targetPath, "utf8");
  } catch (exc) {
    return { nom: entry.nom, action: "ERROR", detail: `lecture impossible : ${exc.message}` };
  }

  const debut = texte.indexOf(entry.marqueur_debut);
  const fin = texte.indexOf(entry.marqueur_fin);

  if (debut === -1 && fin === -1) {
    return { nom: entry.nom, action: "CREATE", detail: "bloc AES absent, sera ajouté en fin de fichier" };
  }

  // Un seul des deux marqueurs présent, ou dans le mauvais ordre : le
  // fichier a été altéré manuellement d'une façon incohérente. Bloque
  // plutôt que de deviner une intention, pour éviter de corrompre un
  // CLAUDE.md potentiellement très personnalisé.
  if (debut === -1 || fin === -1 || fin < debut) {
    return { nom: entry.nom, action: "ERROR", detail: "marqueurs AES incohérents (l'un des deux est absent ou mal ordonné)" };
  }

  const finReelle = fin + entry.marqueur_fin.length;
  const blocActuel = texte.slice(debut, finReelle).trim();

  if (blocActuel === entry.contenu.trim()) {
    return { nom: entry.nom, action: "SKIP", detail: "bloc AES déjà conforme" };
  }

  return { nom: entry.nom, action: "REVIEW", detail: "bloc AES présent mais différent, proposition seulement" };
}

// Applique la fusion Markdown classée CREATE : ajoute le bloc socle en fin
// de fichier (ou crée le fichier s'il n'existait pas encore), en
// choisissant le séparateur qui évite une ligne vide en trop ou manquante
// selon que le fichier existant se terminait déjà par un retour à la ligne.
function appliquerFusionMarkdown(entry, cibleDir) {
  const targetPath = path.join(cibleDir, entry.destination);
  let texte = "";
  if (fs.existsSync(targetPath)) {
    texte = fs.readFileSync(targetPath, "utf8");
  }
  const separateur = texte.length ? (texte.endsWith("\n") ? "\n" : "\n\n") : "";
  const nouveauTexte = texte + separateur + entry.contenu.trim() + "\n";
  writeAtomic(targetPath, nouveauTexte);
}

// Aiguille chaque entrée du manifeste vers son classificateur selon son
// champ "type" (copie / fusion_json / fusion_markdown), jamais en le
// devinant depuis l'extension ou l'emplacement du fichier (voir AES-D012).
function classifyEntry(entry, repoRoot, cibleDir) {
  if (entry.type === "copie") return classifyCopie(entry, repoRoot, cibleDir);
  if (entry.type === "fusion_json") return classifyFusionJson(entry, cibleDir);
  if (entry.type === "fusion_markdown") return classifyFusionMarkdown(entry, cibleDir);
  return { nom: entry.nom, action: "ERROR", detail: `type d'opération inconnu : ${entry.type}` };
}

// Classe les 4 artefacts du manifeste Claude Code pour un projet cible
// donné. Comme installer.js analyze(), ne lit jamais que le disque,
// n'écrit jamais rien : c'est la fonction utilisée aussi bien par
// 'integration analyze' seule que comme étape préalable avant tout
// 'integration apply'.
function analyze(cibleDir, repoRoot) {
  const manifest = loadManifest();
  return manifest.artefacts.map((entry) => classifyEntry(entry, repoRoot, cibleDir));
}

// Écrit réellement les artefacts classés CREATE par un analyze() précédent.
// operations et manifest.artefacts sont parcourus par le même index i : ça
// suppose que operations vient bien du même manifeste, dans le même ordre,
// ce qui est garanti tant que apply() est toujours appelé juste après un
// analyze() sur le même projet (voir installer.js cmdIntegrationApply, qui
// respecte cet enchaînement).
function apply(cibleDir, repoRoot, operations) {
  const manifest = loadManifest();
  const ecrits = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const entry = manifest.artefacts[i];
    if (op.action !== "CREATE") continue;

    if (entry.type === "copie") {
      const sourcePath = path.join(repoRoot, entry.source);
      const targetPath = path.join(cibleDir, entry.destination);
      writeAtomic(targetPath, fs.readFileSync(sourcePath, "utf8"));
      // Restaure explicitement le bit exécutable après l'écriture : une
      // copie de contenu seule ne préserve pas les permissions du fichier
      // source, indispensable ici puisque aes-reminder.sh doit être
      // exécutable pour que Claude Code puisse le lancer comme hook.
      if (entry.executable) fs.chmodSync(targetPath, 0o755);
    } else if (entry.type === "fusion_json") {
      appliquerFusionJson(entry, cibleDir);
    } else if (entry.type === "fusion_markdown") {
      appliquerFusionMarkdown(entry, cibleDir);
    }
    ecrits.push(entry.nom);
  }
  return ecrits;
}

// Exports utilisés par install/installer.js (registre INTEGRATIONS) et par
// install/tests/test_claude_code_integration.js pour tester directement la
// logique de classification et d'écriture sans passer par le CLI complet.
module.exports = {
  loadManifest,
  deepEqual,
  classifyEntry,
  analyze,
  apply,
};
