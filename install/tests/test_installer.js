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

const installer = require("../installer.js");

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

function nouvelleCible() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aes-test-"));
}

function ia(cible) {
  return path.join(cible, "ia");
}

function nettoyer(cible) {
  fs.rmSync(cible, { recursive: true, force: true });
}

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
