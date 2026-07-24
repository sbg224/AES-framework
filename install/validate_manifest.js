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

// Correspondance entre le statut déclaré dans le manifeste (mot en
// français) et le symbole attendu en tête du fichier source réel
// (ex. "Statut : 🟢 Vivant"). Sert à détecter une désynchronisation entre
// ce que le manifeste affirme et ce que le fichier affiche réellement.
const STATUT_MARKERS = {
  gouvernance: "🔒",
  reference: "🟡",
  vivant: "🟢",
};

// Lit et parse le manifeste du socle depuis le disque.
function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

// Liste les 14 fichiers du socle tels qu'ils existent réellement sur le
// disque du dépôt AES : tous les .md de templates/, plus SYSTEM.md à la
// racine (seul fichier du socle qui n'est pas dans templates/). Triée pour
// permettre une comparaison directe avec la liste du manifeste, elle aussi
// triée avant comparaison.
function fichiersSurDisque() {
  const templates = fs
    .readdirSync(path.join(REPO_ROOT, "templates"))
    .filter((n) => n.endsWith(".md"))
    .sort();
  return [...templates, "SYSTEM.md"].sort();
}

// Extrait la liste des 14 fichiers telle qu'énumérée en prose dans
// docs/INSTALLATION.md, entre deux repères textuels fixes ("Depuis la
// racine du framework" et "Soit 14 fichiers au total"), pour vérifier que
// la documentation lisible par un humain ne diverge jamais du manifeste
// technique. Si ces deux repères venaient à changer de formulation, cette
// fonction renverrait une liste vide ou tronquée plutôt que de lever une
// erreur explicite ; la comparaison qui suit dans main() détecterait quand
// même la divergence (liste vide ≠ 14 fichiers attendus), mais sans
// message clair désignant la cause réelle.
function fichiersDansInstallationMd() {
  const texte = fs.readFileSync(INSTALLATION_MD, "utf8");
  const debut = texte.indexOf("Depuis la racine du framework");
  const fin = texte.indexOf("Soit 14 fichiers au total");
  const bloc = texte.slice(debut, fin);
  const matches = [...bloc.matchAll(/\*\s+([A-Z_]+\.md)/g)].map((m) => m[1]);
  return matches.sort();
}

// Lit la ligne "Statut : <symbole> <mot>" en tête d'un fichier source
// (ex. SYSTEM.md, templates/DECISIONS.md) et retourne uniquement le
// symbole, pour le comparer au symbole attendu selon le statut déclaré
// dans le manifeste (voir STATUT_MARKERS ci-dessus).
function statutDeclareDansLeFichier(cheminSource) {
  const texte = fs.readFileSync(path.join(REPO_ROOT, cheminSource), "utf8");
  const match = texte.match(/^Statut :\s*(\S+)/m);
  return match ? match[1] : null;
}

// Exécute les 5 vérifications de cohérence et affiche le détail de tout
// écart trouvé. Ne s'arrête jamais à la première erreur : accumule tous
// les écarts dans un même passage, pour donner une vue complète en un seul
// lancement plutôt que de forcer plusieurs allers-retours.
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

// Ne s'exécute que si ce fichier est lancé directement en CLI, jamais
// quand il est simplement require()-ié (même logique que installer.js).
if (require.main === module) {
  process.exit(main());
}

// Exports utilisés potentiellement par d'autres scripts ou tests pour
// réutiliser ces vérifications individuellement.
module.exports = { main, loadManifest, fichiersSurDisque, fichiersDansInstallationMd, statutDeclareDansLeFichier };
