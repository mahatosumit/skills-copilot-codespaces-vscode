import fs from "node:fs";
import path from "node:path";
import { parseSkillMarkdown } from "./parser.js";
import { scoreSkill } from "./quality.js";
import { scanSkillPackage } from "./security.js";
import { validateSkillMetadata } from "./validator.js";
import { stringifySimpleYaml } from "./yaml.js";
import { copyFile, ensureDir, slugify, writeText } from "./utils.js";

export function importSkill(sourcePath, options = {}) {
  const absoluteSource = path.resolve(sourcePath);
  const sourceStat = fs.statSync(absoluteSource);
  const skillFile = sourceStat.isDirectory() ? path.join(absoluteSource, "SKILL.md") : absoluteSource;
  if (!fs.existsSync(skillFile)) throw new Error(`No SKILL.md found at ${sourcePath}`);

  const metadata = parseSkillMarkdown(skillFile);
  const scan = scanSkillPackage(sourceStat.isDirectory() ? absoluteSource : skillFile);
  const quality = scoreSkill(metadata, scan);
  const packageMetadata = { ...metadata, id: slugify(metadata.id), quality_score: quality.total, security: scan.passed ? "reviewed" : "blocked" };
  const validation = validateSkillMetadata(packageMetadata);
  if (!validation.valid) throw new Error(`Invalid skill metadata:\n${validation.errors.join("\n")}`);

  const outRoot = path.resolve(options.out || "skills/packages");
  const packageDir = path.join(outRoot, packageMetadata.id);
  ensureDir(packageDir);
  writeText(path.join(packageDir, "skill.yaml"), stringifySimpleYaml(packageMetadata) + "\n");
  copyFile(skillFile, path.join(packageDir, "SKILL.md"));
  writeText(path.join(packageDir, "README.md"), buildReadme(packageMetadata, quality, scan));
  return { packageDir, metadata: packageMetadata, quality, security: scan };
}

function buildReadme(metadata, quality, scan) {
  const securityLines = scan.findings.length ? scan.findings.map((finding) => `- ${finding.severity}: ${finding.message}`).join("\n") : "- No high-risk findings detected by static scan.";
  return `# ${metadata.name}\n\n${metadata.description}\n\n## Metadata\n\n- ID: ${metadata.id}\n- Category: ${metadata.category}\n- Version: ${metadata.version}\n- License: ${metadata.license}\n- Source: ${metadata.source}\n- Compatibility: ${metadata.compatibility.join(", ")}\n- Quality score: ${quality.total}\n\n## Security Scan\n\n${securityLines}\n`;
}
