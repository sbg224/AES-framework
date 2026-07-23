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

const MANIFEST_PATH = path.join(__dirname, "claude_code.manifest.json");

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

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

function classifyEntry(entry, repoRoot, cibleDir) {
  if (entry.type === "copie") return classifyCopie(entry, repoRoot, cibleDir);
  if (entry.type === "fusion_json") return classifyFusionJson(entry, cibleDir);
  if (entry.type === "fusion_markdown") return classifyFusionMarkdown(entry, cibleDir);
  return { nom: entry.nom, action: "ERROR", detail: `type d'opération inconnu : ${entry.type}` };
}

function analyze(cibleDir, repoRoot) {
  const manifest = loadManifest();
  return manifest.artefacts.map((entry) => classifyEntry(entry, repoRoot, cibleDir));
}

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

module.exports = {
  loadManifest,
  deepEqual,
  classifyEntry,
  analyze,
  apply,
};
