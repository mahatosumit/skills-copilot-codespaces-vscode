import fs from "node:fs";
import path from "node:path";
import { loadCatalog } from "./catalog.js";
import { parseSkillPackage } from "./parser.js";
import { copyDir, ensureDir, writeJson } from "./utils.js";

export function installPackage(target, options = {}) {
  const workspace = path.resolve(options.workspace || ".");
  if (fs.existsSync(target)) return installVerifiedPackage(target, workspace, options);
  return installCuratedPack(target, workspace, options);
}

export function listInstalled(workspace = ".") {
  const root = path.resolve(workspace, ".skillx", "skills");
  if (!fs.existsSync(root)) return [];
  const installed = [];
  for (const id of fs.readdirSync(root)) {
    const versionsRoot = path.join(root, id);
    for (const version of fs.readdirSync(versionsRoot)) installed.push({ id, version, path: path.join(versionsRoot, version) });
  }
  return installed;
}

function installVerifiedPackage(packagePath, workspace, options) {
  const metadata = parseSkillPackage(packagePath);
  if (options.version && metadata.version !== options.version) throw new Error(`Version mismatch: requested ${options.version}, package is ${metadata.version}`);
  if (metadata.security !== "reviewed") throw new Error(`Refusing to install unverified skill: ${metadata.id}`);
  if (Number(metadata.quality_score) < Number(options.minScore || 70)) throw new Error(`Refusing to install low-quality skill: ${metadata.id}`);
  const destination = path.join(workspace, ".skillx", "skills", metadata.id, metadata.version);
  copyDir(path.resolve(packagePath), destination);
  writeJson(path.join(workspace, ".skillx", "installed.json"), { updated: new Date().toISOString(), skills: listInstalled(workspace) });
  return { type: "skill", id: metadata.id, version: metadata.version, destination };
}

function installCuratedPack(packId, workspace, options) {
  const catalog = loadCatalog(options.catalog || "skills/catalog.json");
  const pack = (catalog.packs || []).find((entry) => entry.id === packId);
  if (!pack) throw new Error(`Unknown package or curated pack: ${packId}`);
  if (pack.status !== "verified") throw new Error(`Refusing to install unverified pack: ${packId}`);
  const destination = path.join(workspace, ".skillx", "packs", pack.id);
  ensureDir(destination);
  writeJson(path.join(destination, "pack.json"), pack);
  return { type: "pack", id: pack.id, destination, skills: pack.skills };
}
