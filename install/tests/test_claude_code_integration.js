"use strict";

/**
 * Tests déterministes de l'intégration Claude Code (install/integrations/claude_code.js).
 *
 * Aucun agent génératif impliqué, uniquement la logique de classification et
 * d'écriture (copie de gabarit, fusion JSON additive, fusion Markdown par
 * marqueurs). Voir AES-D012 (DECISIONS.md) pour l'architecture.
 *
 * Usage : node --test install/tests/test_claude_code_integration.js
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const installer = require("../installer.js");
const claudeCode = require("../integrations/claude_code.js");

// Réutilise la racine du dépôt AES déjà calculée par installer.js, pour ne
// jamais la recalculer différemment ici (une seule source de vérité pour
// "où se trouve le dépôt AES").
const REPO_ROOT = installer.REPO_ROOT;
// Fixture représentant un CLAUDE.md très personnalisé (contenu, sections,
// mise en forme propres à un projet réel), chargée une seule fois pour
// tous les tests qui vérifient que ce contenu reste intact après une
// installation ou une réapplication de l'intégration.
const FIXTURE_CLAUDE_MD = fs.readFileSync(
  path.join(__dirname, "fixtures", "claude_code_integration", "CLAUDE_md_personnalise.md"),
  "utf8"
);

// Même rôle que dans test_installer.js : crée un dépôt git vide avec une
// identité de commit minimale, nécessaire car apply() refuse d'écrire sans
// dépôt git par défaut.
function gitInitPropre(chemin) {
  spawnSync("git", ["init", "-q", chemin], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "config", "user.email", "test@test.com"]);
  spawnSync("git", ["-C", chemin, "config", "user.name", "test"]);
}

// Commite tout le contenu déjà présent dans le dossier de test, pour
// simuler un projet où les fichiers pré-existants (CLAUDE.md personnalisé,
// settings.json personnalisé, etc.) sont déjà enregistrés en git, et isoler
// ainsi ce que le test vérifie réellement de la précondition d'arbre propre.
function gitCommitTout(chemin) {
  spawnSync("git", ["-C", chemin, "add", "-A"], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "commit", "-q", "-m", "fixture"], { encoding: "utf8" });
}

// Dossier temporaire unique par test (préfixé différemment de
// test_installer.js pour ne jamais confondre les deux séries de dossiers
// de test si on inspecte /tmp manuellement).
function nouvelleCible() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aes-claude-code-test-"));
}

function nettoyer(cible) {
  fs.rmSync(cible, { recursive: true, force: true });
}

// Convertit un tableau d'opérations (tel que renvoyé par analyze()) en un
// objet indexé par nom d'artefact, pour pouvoir écrire
// parNom(operations)["aes-reminder.sh"].action plutôt que de chercher dans
// un tableau à chaque assertion.
function parNom(operations) {
  return Object.fromEntries(operations.map((op) => [op.nom, op]));
}

// Raccourci vers claudeCode.analyze(), qui a besoin à la fois du dossier
// cible et de la racine du dépôt AES (pour localiser les fichiers source à
// copier).
function analyze(cible) {
  return claudeCode.analyze(cible, REPO_ROOT);
}

// Raccourci vers l'application complète de l'intégration via le CLI
// installer.js (et non directement claudeCode.apply()), pour tester le
// même chemin de code que celui réellement emprunté par un utilisateur en
// ligne de commande, préconditions git comprises.
function apply(cible, allowNoGit, allowDirty) {
  return installer.cmdIntegrationApply({ agent: "claude-code", cheminProjet: cible, allowNoGit, allowDirty });
}

// Cas nominal : sur un projet vierge, les 4 artefacts (skill, script de
// hook, entrée settings.json, bloc CLAUDE.md) doivent tous être classés
// CREATE, puis réellement écrits aux bons emplacements dans .claude/.
test("installation neuve crée les quatre artefacts", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    const operations = analyze(cible);
    assert.equal(operations.length, 4);
    assert.ok(operations.every((op) => op.action === "CREATE"));

    const code = apply(cible, false, false);
    assert.equal(code, 0);
    assert.ok(fs.existsSync(path.join(cible, ".claude/skills/aes-check/SKILL.md")));
    assert.ok(fs.existsSync(path.join(cible, ".claude/hooks/aes-reminder.sh")));
    assert.ok(fs.existsSync(path.join(cible, ".claude/settings.json")));
    assert.ok(fs.existsSync(path.join(cible, "CLAUDE.md")));
  } finally {
    nettoyer(cible);
  }
});

// Le script de hook copié doit porter le bit exécutable (0o111 = droits
// d'exécution pour user/group/other), sans quoi Claude Code ne pourrait
// pas le lancer. Vérifie concrètement que le chmodSync(0o755) explicite
// dans claude_code.js apply() a bien été appliqué après la copie.
test("le script installé est exécutable", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    apply(cible, false, false);
    const mode = fs.statSync(path.join(cible, ".claude/hooks/aes-reminder.sh")).mode;
    assert.ok(mode & 0o111, "le script doit porter le bit exécutable");
  } finally {
    nettoyer(cible);
  }
});

// Vérifie précisément le correctif décrit dans AES-D012 : le chemin écrit
// dans .claude/settings.json doit être celui réellement installé dans le
// projet cible (.claude/hooks/aes-reminder.sh), jamais un chemin qui
// reproduirait l'organisation interne du dépôt AES
// (integrations/claude-code/hooks/...), ce qui produirait une
// configuration silencieusement cassée sur le projet cible.
test("le chemin du hook installé pointe vers .claude/hooks/, jamais vers l'organisation interne du dépôt AES", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    apply(cible, false, false);
    const settings = JSON.parse(fs.readFileSync(path.join(cible, ".claude/settings.json"), "utf8"));
    const commande = settings.hooks.UserPromptSubmit[0].hooks[0].command;
    assert.equal(commande, "$CLAUDE_PROJECT_DIR/.claude/hooks/aes-reminder.sh");
    assert.ok(!commande.includes("integrations/claude-code"));
  } finally {
    nettoyer(cible);
  }
});

// Relancer l'intégration une seconde fois ne doit rien changer : ni
// settings.json ni CLAUDE.md ne doivent différer octet pour octet, et la
// ré-analyse doit classer les 4 artefacts en SKIP. Même garantie
// d'idempotence que pour le socle ia/, ici testée sur des fusions
// (JSON et Markdown) plutôt que sur de simples copies.
test("exécution répétée est idempotente sur les quatre artefacts", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    apply(cible, false, true);

    const avantSettings = fs.readFileSync(path.join(cible, ".claude/settings.json"), "utf8");
    const avantClaudeMd = fs.readFileSync(path.join(cible, "CLAUDE.md"), "utf8");

    const code = apply(cible, false, true);
    assert.equal(code, 0);
    assert.equal(fs.readFileSync(path.join(cible, ".claude/settings.json"), "utf8"), avantSettings);
    assert.equal(fs.readFileSync(path.join(cible, "CLAUDE.md"), "utf8"), avantClaudeMd);

    const operations = analyze(cible);
    assert.ok(operations.every((op) => op.action === "SKIP"));
  } finally {
    nettoyer(cible);
  }
});

// Le test le plus représentatif d'un cas réel : un CLAUDE.md déjà
// fortement personnalisé par le développeur (contenu métier, sections,
// mise en forme propres à son projet) doit rester intact au caractère
// près, avant comme après une ou plusieurs applications successives ;
// seul le bloc AES délimité par les marqueurs doit apparaître, ajouté à
// la suite du contenu existant, jamais à la place.
test("CLAUDE.md fortement personnalisé est préservé à l'identique, seul le bloc AES est ajouté", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.writeFileSync(path.join(cible, "CLAUDE.md"), FIXTURE_CLAUDE_MD, "utf8");
    gitCommitTout(cible);

    const operations = analyze(cible);
    assert.equal(parNom(operations)["bloc socle"].action, "CREATE");

    apply(cible, false, false);
    const resultat = fs.readFileSync(path.join(cible, "CLAUDE.md"), "utf8");

    assert.ok(resultat.startsWith(FIXTURE_CLAUDE_MD.trimEnd()), "le contenu personnalisé doit rester intact et en tête de fichier");
    assert.ok(resultat.includes("<!-- AES:SOCLE:BEGIN -->"));
    assert.ok(resultat.includes("@ia/SYSTEM.md"));

    // Réapplication : le contenu personnalisé doit rester identique au caractère près.
    apply(cible, false, false);
    const resultat2 = fs.readFileSync(path.join(cible, "CLAUDE.md"), "utf8");
    assert.equal(resultat2, resultat);
    assert.ok(resultat2.includes(FIXTURE_CLAUDE_MD.trimEnd()));
  } finally {
    nettoyer(cible);
  }
});

// Si l'utilisateur a modifié à la main l'entrée de hook déjà installée
// (ex. changé le timeout), elle doit être classée REVIEW (jamais réécrite
// automatiquement, statut "reference" comme pour le socle), et rester
// strictement inchangée après apply() — y compris le reste de
// settings.json (permissions, autre hook PreToolUse), vérifié ici par une
// égalité stricte de l'objet entier avant/après.
test("hook AES modifié localement produit REVIEW et n'est jamais réécrit", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.mkdirSync(path.join(cible, ".claude"), { recursive: true });
    const settingsPersonnalise = {
      permissions: { allow: ["Bash(npm run *)"] },
      hooks: {
        PreToolUse: [{ matcher: "Bash", hooks: [{ type: "command", command: "echo hi" }] }],
        UserPromptSubmit: [
          {
            matcher: "*",
            hooks: [{ type: "command", command: "$CLAUDE_PROJECT_DIR/.claude/hooks/aes-reminder.sh", timeout: 99 }],
          },
        ],
      },
    };
    fs.writeFileSync(path.join(cible, ".claude/settings.json"), JSON.stringify(settingsPersonnalise, null, 2), "utf8");
    gitCommitTout(cible);

    const operations = analyze(cible);
    assert.equal(parNom(operations)["hook UserPromptSubmit"].action, "REVIEW");
    assert.equal(installer.globalState(operations), "COMPLETED_WITH_REVIEW");

    apply(cible, false, false);
    const apres = JSON.parse(fs.readFileSync(path.join(cible, ".claude/settings.json"), "utf8"));
    assert.deepEqual(apres, settingsPersonnalise);
  } finally {
    nettoyer(cible);
  }
});

// Un settings.json syntaxiquement invalide (JSON cassé) doit bloquer
// TOUTE l'application, y compris les artefacts par ailleurs indépendants
// (ici SKILL.md) : mieux vaut ne rien écrire du tout que de risquer de
// travailler à côté d'un fichier de configuration que l'installateur ne
// comprend pas.
test("settings.json invalide bloque toute écriture, y compris les artefacts indépendants", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.mkdirSync(path.join(cible, ".claude"), { recursive: true });
    fs.writeFileSync(path.join(cible, ".claude/settings.json"), "{ ceci n'est pas du JSON", "utf8");
    gitCommitTout(cible);

    const operations = analyze(cible);
    assert.equal(parNom(operations)["hook UserPromptSubmit"].action, "ERROR");
    assert.equal(installer.globalState(operations), "ERROR");

    const code = apply(cible, false, false);
    assert.equal(code, 1);
    assert.ok(!fs.existsSync(path.join(cible, ".claude/skills/aes-check/SKILL.md")));
  } finally {
    nettoyer(cible);
  }
});

// Si les marqueurs <!-- AES:SOCLE:BEGIN/END --> sont présents de façon
// incohérente dans CLAUDE.md (ici : début sans fin), l'installateur doit
// refuser de deviner une intention et bloquer toute l'application plutôt
// que de risquer de corrompre un fichier potentiellement très personnalisé.
test("marqueurs CLAUDE.md incohérents produisent ERROR et bloquent tout", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.writeFileSync(path.join(cible, "CLAUDE.md"), "<!-- AES:SOCLE:BEGIN -->\nsans marqueur de fin\n", "utf8");
    gitCommitTout(cible);

    const operations = analyze(cible);
    assert.equal(parNom(operations)["bloc socle"].action, "ERROR");
    assert.equal(installer.globalState(operations), "ERROR");

    const code = apply(cible, false, false);
    assert.equal(code, 1);
  } finally {
    nettoyer(cible);
  }
});

// Même garantie que pour le socle ia/ : sans dépôt git, apply() refuse
// d'écrire (code 1, dossier .claude/ jamais créé) sauf drapeau explicite
// --allow-no-git, auquel cas l'écriture doit réussir normalement.
test("refus sans git sauf drapeau explicite", () => {
  const cible = nouvelleCible();
  try {
    assert.equal(apply(cible, false, false), 1);
    assert.ok(!fs.existsSync(path.join(cible, ".claude")));

    assert.equal(apply(cible, true, false), 0);
    assert.ok(fs.existsSync(path.join(cible, ".claude")));
  } finally {
    nettoyer(cible);
  }
});

// Même garantie que pour le socle ia/ : un arbre git non propre (ici, un
// fichier non suivi) doit suffire à faire refuser l'écriture tant que
// --allow-dirty n'est pas passé explicitement.
test("refus arbre sale sauf drapeau explicite", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.writeFileSync(path.join(cible, "fichier_non_suivi.txt"), "x", "utf8");

    assert.equal(apply(cible, false, false), 1);
    assert.ok(!fs.existsSync(path.join(cible, ".claude")));
  } finally {
    nettoyer(cible);
  }
});

// Demander une intégration qui n'existe pas dans le registre INTEGRATIONS
// de installer.js (ici "codex", non encore implémenté) doit produire une
// erreur explicite (code 1), jamais un plantage ni un comportement silencieux.
test("intégration inconnue produit une erreur explicite", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    const code = installer.cmdIntegrationApply({ agent: "codex", cheminProjet: cible, allowNoGit: false, allowDirty: false });
    assert.equal(code, 1);
  } finally {
    nettoyer(cible);
  }
});

// analyze() seule ne doit jamais nécessiter de dépôt git ni écrire quoi
// que ce soit, même sur un dossier totalement vierge sans .claude/ ni
// CLAUDE.md — même garantie que pour le socle ia/.
test("analyze fonctionne sans git et sans écrire", () => {
  const cible = nouvelleCible();
  try {
    const operations = analyze(cible);
    assert.equal(operations.length, 4);
    assert.ok(!fs.existsSync(path.join(cible, ".claude")));
    assert.ok(!fs.existsSync(path.join(cible, "CLAUDE.md")));
  } finally {
    nettoyer(cible);
  }
});

// writeAtomic() (voir lib/core.js) passe par un fichier ".tmp" intermédiaire
// avant de renommer : ce test parcourt tout le projet après une application
// réussie pour vérifier qu'aucun de ces fichiers temporaires n'a été
// oublié sur le disque, ce qui indiquerait une écriture atomique mal
// terminée.
test("aucun fichier .tmp résiduel après une application réussie", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    apply(cible, false, false);
    const tousLesFichiers = [];
    const parcourir = (dir) => {
      for (const nom of fs.readdirSync(dir)) {
        const p = path.join(dir, nom);
        if (fs.statSync(p).isDirectory()) parcourir(p);
        else tousLesFichiers.push(p);
      }
    };
    parcourir(cible);
    assert.ok(!tousLesFichiers.some((f) => f.endsWith(".tmp")));
  } finally {
    nettoyer(cible);
  }
});
