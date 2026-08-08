import fs from "node:fs";
import path from "node:path";
import { copyFile, ensureDir } from "./utils.js";

export const exportTargets = {
  codex: ".codex/skills",
  opencode: ".opencode/skills",
  claude: ".claude/skills",
  copilot: ".github/copilot",
  vscode: ".vscode/skills"
};

export function exportSkillPackage(agent, packageDir, options = {}) {
  if (!exportTargets[agent]) throw new Error(`Unsupported export target: ${agent}`);
  const absolutePackage = path.resolve(packageDir);
  const skillFile = path.join(absolutePackage, "SKILL.md");
  const metadataFile = path.join(absolutePackage, "skill.yaml");
  if (!fs.existsSync(skillFile)) throw new Error(`Missing SKILL.md in ${packageDir}`);
  if (!fs.existsSync(metadataFile)) throw new Error(`Missing skill.yaml in ${packageDir}`);
  const outRoot = path.resolve(options.out || ".");
  const destination = path.join(outRoot, exportTargets[agent], path.basename(absolutePackage));
  ensureDir(destination);
  copyFile(skillFile, path.join(destination, "SKILL.md"));
  copyFile(metadataFile, path.join(destination, "skill.yaml"));
  return { destination };
}
