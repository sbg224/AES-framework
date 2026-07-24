"use strict";

/**
 * Garanties transverses partagées entre install/installer.js (socle ia/) et
 * install/integrations/*.js (intégrations d'agents), voir AES-D012.
 *
 * Aucune connaissance du socle ni d'un agent précis ici, uniquement des
 * primitives génériques (git, écriture atomique, agrégation de statut).
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

/**
 * Détecte l'état git du dossier cible, sans jamais rien modifier.
 *
 * Retourne 'absent' (aucun dépôt git trouvé, ou commande git introuvable
 * sur la machine), 'sale' (dépôt git avec des modifications non commitées,
 * trackées ou non) ou 'propre' (dépôt git sans aucune modification en
 * attente). C'est ce résultat que installer.js utilise pour appliquer les
 * préconditions --allow-no-git / --allow-dirty avant tout apply().
 *
 * spawnSync est appelé avec un tableau d'arguments, jamais une chaîne
 * shell : aucune injection de commande possible même si cibleDir contenait
 * des caractères spéciaux.
 */
function gitState(cibleDir) {
  const check = spawnSync("git", ["-C", cibleDir, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8" });
  if (check.status !== 0) return "absent";

  const status = spawnSync("git", ["-C", cibleDir, "status", "--porcelain"], { encoding: "utf8" });
  return status.stdout.trim() ? "sale" : "propre";
}

/**
 * Écrit un fichier de façon atomique : jamais d'état intermédiaire visible
 * ou corrompu sur targetPath, même en cas d'interruption du process pendant
 * l'écriture.
 *
 * Principe : on écrit d'abord le contenu complet dans un fichier temporaire
 * voisin (targetPath + ".tmp"), puis on renomme ce fichier temporaire par
 * dessus targetPath. Un renommage sur le même système de fichiers est une
 * opération atomique au niveau du système d'exploitation : à tout instant,
 * targetPath contient soit l'ancien contenu en entier, soit le nouveau en
 * entier, jamais un mélange des deux.
 *
 * mkdirSync({ recursive: true }) crée aussi les dossiers parents manquants
 * (par exemple .claude/hooks/ s'il n'existe pas encore).
 */
function writeAtomic(targetPath, contenu) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const temporaire = `${targetPath}.tmp`;
  fs.writeFileSync(temporaire, contenu, "utf8");
  fs.renameSync(temporaire, targetPath); // remplacement atomique
}

/**
 * Agrège une liste d'opérations (une par fichier ou artefact) en un seul
 * état global, utilisé pour décider si un apply() peut écrire ou doit être
 * intégralement refusé. Priorité stricte, du pire au meilleur cas :
 *
 *   ERROR                  : au moins une opération n'a pas pu être classée
 *                            (source introuvable, JSON invalide, etc.).
 *   BLOCKED_BY_CONFLICT    : au moins un fichier "gouvernance" diffère de
 *                            son gabarit, aucune écriture n'est autorisée
 *                            tant que ce n'est pas résolu explicitement.
 *   COMPLETED_WITH_REVIEW  : aucune erreur ni conflit, mais au moins un
 *                            fichier "reference" diffère du gabarit ; les
 *                            CREATE indépendants s'appliquent quand même,
 *                            une revue humaine est seulement proposée pour
 *                            ceux-là.
 *   OK                     : tout est soit déjà conforme (SKIP), soit prêt
 *                            à être créé (CREATE), rien à signaler.
 */
function globalState(operations) {
  if (operations.some((op) => op.action === "ERROR")) return "ERROR";
  if (operations.some((op) => op.action === "CONFLICT")) return "BLOCKED_BY_CONFLICT";
  if (operations.some((op) => op.action === "REVIEW")) return "COMPLETED_WITH_REVIEW";
  return "OK";
}

module.exports = { gitState, writeAtomic, globalState };
