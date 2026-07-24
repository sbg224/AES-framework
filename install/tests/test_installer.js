"use strict";

/**
 * Tests déterministes de install/installer.js.
 *
 * Aucun agent génératif impliqué : uniquement la logique du script
 * (classification, écriture, préconditions git). Le protocole comportemental
 * de /aes-check est décrit séparément dans install/tests/aes_check_protocole.md.
 *
 * Usage : node --test install/tests/test_installer.js
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

// installer.js exporte ses fonctions internes (voir la fin de ce fichier)
// précisément pour permettre ce genre d'appel direct depuis les tests,
// sans passer par un sous-processus ni parser une sortie texte.
const installer = require("../installer.js");

// Initialise un dépôt git vide dans `chemin`, avec une identité de commit
// minimale. Nécessaire car cmdApply() refuse d'écrire sans dépôt git par
// défaut (précondition --allow-no-git) : la plupart des tests ont donc
// besoin d'un dépôt git valide pour observer le comportement normal, pas
// seulement le cas de refus.
function gitInitPropre(chemin) {
  spawnSync("git", ["init", "-q", chemin], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "config", "user.email", "test@test.com"]);
  spawnSync("git", ["-C", chemin, "config", "user.name", "test"]);
}

/** Simule un projet réel où les fichiers pré-existants sont déjà commités,
 * pour isoler ce que le test vérifie réellement (la logique de classification)
 * de la précondition d'arbre propre, testée séparément. */
function gitCommitTout(chemin) {
  spawnSync("git", ["-C", chemin, "add", "-A"], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "commit", "-q", "-m", "fixture"], { encoding: "utf8" });
}

// Crée un dossier temporaire unique (via mkdtemp, qui garantit l'absence de
// collision entre exécutions parallèles de tests) pour servir de "projet
// cible" jetable pour un seul test.
function nouvelleCible() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aes-test-"));
}

// Raccourci vers le sous-dossier "ia/" du projet cible, là où le socle AES
// est effectivement installé (voir installation.manifest.json
// "destination_racine").
function ia(cible) {
  return path.join(cible, "ia");
}

// Supprime récursivement le dossier temporaire créé par nouvelleCible(),
// appelé systématiquement dans un bloc finally pour ne jamais laisser de
// dossier de test orphelin même si les assertions du test échouent.
function nettoyer(cible) {
  fs.rmSync(cible, { recursive: true, force: true });
}

// Cas nominal : sur un projet vierge, les 14 fichiers du socle doivent
// tous être classés CREATE par analyze(), puis réellement écrits par
// cmdApply(), avec un code de sortie 0.
test("installation neuve crée les 14 fichiers", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    const operations = installer.analyze(cible);
    assert.equal(operations.length, 14);
    assert.ok(operations.every((op) => op.action === "CREATE"));

    const code = installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false });
    assert.equal(code, 0);
    assert.equal(fs.readdirSync(ia(cible)).filter((n) => n.endsWith(".md")).length, 14);
  } finally {
    nettoyer(cible);
  }
});

// Relancer apply() une seconde fois sur un projet déjà installé ne doit
// produire aucun changement (contenu strictement identique fichier par
// fichier) et classer tout en SKIP à la ré-analyse : c'est la garantie
// d'idempotence, indispensable pour pouvoir relancer l'installateur sans
// risque après une interruption (voir install/README.md §12).
test("exécution répétée est idempotente", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: true });
    const avant = {};
    for (const f of fs.readdirSync(ia(cible))) avant[f] = fs.readFileSync(path.join(ia(cible), f), "utf8");

    const code = installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: true });
    const apres = {};
    for (const f of fs.readdirSync(ia(cible))) apres[f] = fs.readFileSync(path.join(ia(cible), f), "utf8");

    assert.equal(code, 0);
    assert.deepEqual(avant, apres);
    const operations = installer.analyze(cible);
    assert.ok(operations.every((op) => op.action === "SKIP"));
  } finally {
    nettoyer(cible);
  }
});

// Un document "vivant" (ex. CONTEXT.md) déjà présent avec un contenu
// personnalisé par le développeur ne doit jamais être touché (SKIP, quel
// que soit son contenu), alors que les autres fichiers absents du même
// projet doivent quand même être créés normalement (CREATE indépendants).
test("installation partielle ne touche pas le vivant existant", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.mkdirSync(ia(cible));
    const contenuPersonnalise = "CONTEXT.md\n\nContenu réel du développeur, jamais généré.\n";
    fs.writeFileSync(path.join(ia(cible), "CONTEXT.md"), contenuPersonnalise, "utf8");
    gitCommitTout(cible);

    const operations = installer.analyze(cible);
    const parNom = Object.fromEntries(operations.map((op) => [op.nom, op]));
    assert.equal(parNom["CONTEXT.md"].action, "SKIP");
    assert.equal(parNom["SYSTEM.md"].action, "CREATE");

    installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false });
    assert.equal(fs.readFileSync(path.join(ia(cible), "CONTEXT.md"), "utf8"), contenuPersonnalise);
    assert.ok(fs.existsSync(path.join(ia(cible), "SYSTEM.md")));
  } finally {
    nettoyer(cible);
  }
});

// Un fichier "gouvernance" (ex. SYSTEM.md) modifié à la main et différent
// de son gabarit doit bloquer TOUTE l'installation (état global
// BLOCKED_BY_CONFLICT, code de sortie 1), y compris les fichiers par
// ailleurs valides qui auraient normalement été créés (ici AGENT.md) :
// c'est la garantie qu'une installation partielle silencieuse n'est
// jamais possible en cas de conflit de gouvernance.
test("conflit gouvernance bloque toute l'application", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.mkdirSync(ia(cible));
    fs.writeFileSync(path.join(ia(cible), "SYSTEM.md"), "SYSTEM.md modifié à la main, non conforme", "utf8");
    gitCommitTout(cible);

    const operations = installer.analyze(cible);
    assert.equal(installer.globalState(operations), "BLOCKED_BY_CONFLICT");

    const code = installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false });
    assert.equal(code, 1);
    // Aucun fichier ne doit avoir été créé malgré des CREATE valides par ailleurs.
    assert.ok(!fs.existsSync(path.join(ia(cible), "AGENT.md")));
  } finally {
    nettoyer(cible);
  }
});

// À l'inverse du cas "gouvernance" ci-dessus, un fichier "reference" (ex.
// WORKFLOW.md) modifié ne bloque PAS le reste de l'installation : il est
// seulement classé REVIEW (proposition, jamais un remplacement forcé), et
// les autres CREATE indépendants (ici AGENT.md) continuent de s'appliquer
// normalement, avec un code de sortie 0 malgré l'état COMPLETED_WITH_REVIEW.
test("review référence n'accroît pas le reste et ne remplace rien", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.mkdirSync(ia(cible));
    const contenuPersonnalise = "WORKFLOW.md modifié par le développeur";
    fs.writeFileSync(path.join(ia(cible), "WORKFLOW.md"), contenuPersonnalise, "utf8");
    gitCommitTout(cible);

    const operations = installer.analyze(cible);
    const parNom = Object.fromEntries(operations.map((op) => [op.nom, op]));
    assert.equal(parNom["WORKFLOW.md"].action, "REVIEW");
    assert.equal(installer.globalState(operations), "COMPLETED_WITH_REVIEW");

    const code = installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false });
    assert.equal(code, 0);
    assert.equal(fs.readFileSync(path.join(ia(cible), "WORKFLOW.md"), "utf8"), contenuPersonnalise);
    assert.ok(fs.existsSync(path.join(ia(cible), "AGENT.md"))); // les CREATE indépendants continuent
  } finally {
    nettoyer(cible);
  }
});

// Sans dépôt git du tout, apply() doit refuser d'écrire (code 1, dossier
// ia/ jamais créé) tant que --allow-no-git n'est pas passé explicitement ;
// avec ce drapeau, l'écriture doit réussir normalement (code 0).
test("refus sans git sauf drapeau explicite", () => {
  const cible = nouvelleCible();
  try {
    assert.equal(installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false }), 1);
    assert.ok(!fs.existsSync(ia(cible)));

    assert.equal(installer.cmdApply({ cheminProjet: cible, allowNoGit: true, allowDirty: false }), 0);
    assert.ok(fs.existsSync(ia(cible)));
  } finally {
    nettoyer(cible);
  }
});

// Même logique que le test précédent, mais pour la précondition d'arbre
// git propre : un fichier non suivi (non ajouté, non commité) doit
// suffire à faire refuser l'écriture tant que --allow-dirty n'est pas
// passé explicitement.
test("refus arbre sale sauf drapeau explicite", () => {
  const cible = nouvelleCible();
  try {
    gitInitPropre(cible);
    fs.writeFileSync(path.join(cible, "fichier_non_suivi.txt"), "x", "utf8");

    assert.equal(installer.cmdApply({ cheminProjet: cible, allowNoGit: false, allowDirty: false }), 1);
    assert.ok(!fs.existsSync(ia(cible)));
  } finally {
    nettoyer(cible);
  }
});

// analyze() seule (sans apply()) ne doit jamais nécessiter de dépôt git ni
// écrire quoi que ce soit, même sur un dossier totalement vierge : c'est
// la garantie qui permet de l'utiliser en toute sécurité pour un simple
// aperçu avant de décider d'installer.
test("analyze fonctionne sans git et sans écrire", () => {
  const cible = nouvelleCible();
  try {
    const operations = installer.analyze(cible);
    assert.equal(operations.length, 14);
    assert.ok(!fs.existsSync(ia(cible)));
  } finally {
    nettoyer(cible);
  }
});

// Si le fichier source déclaré dans une entrée du manifeste n'existe pas
// réellement dans le dépôt AES, classifyFile() doit le signaler par une
// action ERROR explicite plutôt que de planter ou de l'ignorer
// silencieusement. Appel direct à classifyFile() (pas besoin de git ici
// puisqu'aucune écriture n'est impliquée).
test("source introuvable produit ERROR", () => {
  const cible = nouvelleCible();
  try {
    const entry = { nom: "INEXISTANT.md", source: "templates/INEXISTANT.md", statut: "reference" };
    const operation = installer.classifyFile(entry, ia(cible));
    assert.equal(operation.action, "ERROR");
  } finally {
    nettoyer(cible);
  }
});
