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

function globalState(operations) {
  if (operations.some((op) => op.action === "ERROR")) return "ERROR";
  if (operations.some((op) => op.action === "CONFLICT")) return "BLOCKED_BY_CONFLICT";
  if (operations.some((op) => op.action === "REVIEW")) return "COMPLETED_WITH_REVIEW";
  return "OK";
}

module.exports = { gitState, writeAtomic, globalState };
