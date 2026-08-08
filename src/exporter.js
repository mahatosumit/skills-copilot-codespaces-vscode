import fs from "node:fs";
import path from "node:path";
import { parseSkillYaml } from "./parser.js";
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
  const metadata = parseSkillYaml(metadataFile);
  const packageName = metadata.id || path.basename(absolutePackage);
  const outRoot = path.resolve(options.out || ".");
  const destination = path.join(outRoot, exportTargets[agent], packageName);
  ensureDir(destination);
  for (const file of ["SKILL.md", "skill.yaml", "README.md", "quality-report.json"]) {
    const source = path.join(absolutePackage, file);
    if (fs.existsSync(source)) copyFile(source, path.join(destination, file));
  }
  return { destination };
}
