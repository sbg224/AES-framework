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

const REPO_ROOT = installer.REPO_ROOT;
const FIXTURE_CLAUDE_MD = fs.readFileSync(
  path.join(__dirname, "fixtures", "claude_code_integration", "CLAUDE_md_personnalise.md"),
  "utf8"
);

function gitInitPropre(chemin) {
  spawnSync("git", ["init", "-q", chemin], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "config", "user.email", "test@test.com"]);
  spawnSync("git", ["-C", chemin, "config", "user.name", "test"]);
}

function gitCommitTout(chemin) {
  spawnSync("git", ["-C", chemin, "add", "-A"], { encoding: "utf8" });
  spawnSync("git", ["-C", chemin, "commit", "-q", "-m", "fixture"], { encoding: "utf8" });
}

function nouvelleCible() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aes-claude-code-test-"));
}

function nettoyer(cible) {
  fs.rmSync(cible, { recursive: true, force: true });
}

function parNom(operations) {
  return Object.fromEntries(operations.map((op) => [op.nom, op]));
}

function analyze(cible) {
  return claudeCode.analyze(cible, REPO_ROOT);
}

function apply(cible, allowNoGit, allowDirty) {
  return installer.cmdIntegrationApply({ agent: "claude-code", cheminProjet: cible, allowNoGit, allowDirty });
}

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
