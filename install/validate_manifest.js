#!/usr/bin/env node
"use strict";

/**
 * Vérifie que installation.manifest.json ne diverge ni du système de
 * fichiers réel, ni de la liste en prose d'INSTALLATION.md, ni du statut
 * déclaré dans l'en-tête de chaque fichier source.
 *
 * Usage : node install/validate_manifest.js
 * Code de sortie 0 si tout concorde, 1 sinon (avec le détail des écarts).
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(REPO_ROOT, "install", "installation.manifest.json");
const INSTALLATION_MD = path.join(REPO_ROOT, "docs", "INSTALLATION.md");

const STATUT_MARKERS = {
  gouvernance: "🔒",
  reference: "🟡",
  vivant: "🟢",
};

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function fichiersSurDisque() {
  const templates = fs
    .readdirSync(path.join(REPO_ROOT, "templates"))
    .filter((n) => n.endsWith(".md"))
    .sort();
  return [...templates, "SYSTEM.md"].sort();
}

function fichiersDansInstallationMd() {
  const texte = fs.readFileSync(INSTALLATION_MD, "utf8");
  const debut = texte.indexOf("Depuis la racine du framework");
  const fin = texte.indexOf("Soit 14 fichiers au total");
  const bloc = texte.slice(debut, fin);
  const matches = [...bloc.matchAll(/\*\s+([A-Z_]+\.md)/g)].map((m) => m[1]);
  return matches.sort();
}

function statutDeclareDansLeFichier(cheminSource) {
  const texte = fs.readFileSync(path.join(REPO_ROOT, cheminSource), "utf8");
  const match = texte.match(/^Statut :\s*(\S+)/m);
  return match ? match[1] : null;
}

function main() {
  const erreurs = [];
  const manifest = loadManifest();
  const nomsManifest = manifest.fichiers.map((f) => f.nom).sort();

  // 1. Le manifeste doit lister exactement 14 fichiers.
  if (nomsManifest.length !== 14) {
    erreurs.push(`le manifeste liste ${nomsManifest.length} fichiers, 14 attendus`);
  }

  // 2. Le manifeste doit correspondre exactement au système de fichiers réel.
  const reel = fichiersSurDisque();
  if (JSON.stringify(nomsManifest) !== JSON.stringify(reel)) {
    erreurs.push(`divergence manifeste / système de fichiers : manifeste=${nomsManifest}, disque=${reel}`);
  }

  // 3. Le manifeste doit correspondre exactement à la liste en prose d'INSTALLATION.md.
  const prose = fichiersDansInstallationMd();
  if (JSON.stringify(nomsManifest) !== JSON.stringify(prose)) {
    erreurs.push(`divergence manifeste / INSTALLATION.md : manifeste=${nomsManifest}, prose=${prose}`);
  }

  // 4. Le socle doit être un sous-ensemble des fichiers listés.
  for (const nom of manifest.socle) {
    if (!nomsManifest.includes(nom)) {
      erreurs.push(`'${nom}' figure dans le socle mais pas dans la liste des fichiers`);
    }
  }

  // 5. Le statut déclaré dans le manifeste doit correspondre au champ
  //    'Statut :' réel du fichier source.
  for (const entry of manifest.fichiers) {
    const chemin = path.join(REPO_ROOT, entry.source);
    if (!fs.existsSync(chemin)) {
      erreurs.push(`source introuvable pour '${entry.nom}' : ${entry.source}`);
      continue;
    }
    const statutReel = statutDeclareDansLeFichier(entry.source);
    const marqueurAttendu = STATUT_MARKERS[entry.statut];
    if (!marqueurAttendu) {
      erreurs.push(`statut inconnu dans le manifeste pour '${entry.nom}' : ${entry.statut}`);
    } else if (statutReel !== marqueurAttendu) {
      erreurs.push(
        `'${entry.nom}' : manifeste déclare '${entry.statut}' (${marqueurAttendu}), fichier déclare '${statutReel}'`
      );
    }
  }

  if (erreurs.length) {
    console.error("Manifeste invalide :");
    for (const e of erreurs) console.error(`  - ${e}`);
    return 1;
  }

  console.log("Manifeste valide : cohérent avec le disque, INSTALLATION.md et les statuts déclarés.");
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { main, loadManifest, fichiersSurDisque, fichiersDansInstallationMd, statutDeclareDansLeFichier };
