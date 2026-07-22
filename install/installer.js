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
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(REPO_ROOT, "install", "installation.manifest.json");

const VERSION_LINE_PREFIXES = [
  "Structure : issue d'AES v",
  "Structure : issue d’AES v",
  "Version : ",
];

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

function analyze(cibleDir) {
  const manifest = loadManifest();
  const iaDir = path.join(cibleDir, manifest.destination_racine);
  return manifest.fichiers.map((entry) => classifyFile(entry, iaDir));
}

function globalState(operations) {
  if (operations.some((op) => op.action === "ERROR")) return "ERROR";
  if (operations.some((op) => op.action === "CONFLICT")) return "BLOCKED_BY_CONFLICT";
  if (operations.some((op) => op.action === "REVIEW")) return "COMPLETED_WITH_REVIEW";
  return "OK";
}

function printReport(operations, mode) {
  const largeur = Math.max(...operations.map((op) => op.nom.length));
  for (const op of operations) {
    console.log(`  ${op.action.padEnd(9)} ${op.nom.padEnd(largeur)}  ${op.detail}`);
  }
  console.log();
  console.log(`État global (${mode}) : ${globalState(operations)}`);
}

/** Retourne 'absent', 'sale' ou 'propre'. */
function gitState(cibleDir) {
  const check = spawnSync("git", ["-C", cibleDir, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8" });
  if (check.status !== 0) return "absent";

  const status = spawnSync("git", ["-C", cibleDir, "status", "--porcelain"], { encoding: "utf8" });
  return status.stdout.trim() ? "sale" : "propre";
}

function writeAtomic(targetPath, contenu) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const temporaire = `${targetPath}.tmp`;
  fs.writeFileSync(temporaire, contenu, "utf8");
  fs.renameSync(temporaire, targetPath); // remplacement atomique
}

function cmdAnalyze(args) {
  const cibleDir = path.resolve(args.cheminProjet);
  const operations = analyze(cibleDir);
  console.log(`Analyse de ${cibleDir} (aucune écriture, git ignoré) :\n`);
  printReport(operations, "analyse");
  return 0;
}

function cmdApply(args) {
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

  const manifest = loadManifest();
  const iaDir = path.join(cibleDir, manifest.destination_racine);
  const operations = analyze(cibleDir);

  console.log(`Plan pour ${cibleDir} :\n`);
  printReport(operations, "plan avant écriture");
  console.log();

  const etat = globalState(operations);
  if (etat === "ERROR" || etat === "BLOCKED_BY_CONFLICT") {
    console.error(`Application refusée : état global ${etat}. Aucun fichier écrit.`);
    return 1;
  }

  const ecrits = [];
  try {
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
    console.error(`Échec en cours d'écriture : ${exc.message}`);
    console.error(`Fichiers déjà écrits avant l'échec : ${ecrits.length ? ecrits.join(", ") : "aucun"}`);
    return 1;
  }

  console.log(`Fichiers créés : ${ecrits.length ? ecrits.join(", ") : "aucun"}`);
  console.log(`État final : ${etat}`);
  return 0;
}

function main(argv) {
  const [commande, cheminProjet, ...reste] = argv;
  if (!commande || !cheminProjet) {
    console.error(__filename.endsWith(".js") ? "Usage : node install/installer.js <analyze|apply> <chemin_projet> [--allow-no-git] [--allow-dirty]" : "");
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

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = {
  REPO_ROOT,
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
  main,
};
