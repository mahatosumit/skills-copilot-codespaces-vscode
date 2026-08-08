import fs from "node:fs";
import path from "node:path";
import { parseSkillMarkdown } from "../parser.js";
import { scoreSkill } from "../quality.js";
import { scanSkillPackage } from "../security.js";

export function discoverLocalSkills(rootPath) {
  const root = path.resolve(rootPath);
  const candidates = [];
  if (!fs.existsSync(root)) return candidates;
  for (const file of collectSkillFiles(root)) candidates.push(evaluateCandidate(file, "local"));
  return candidates;
}

export function discoverSkillsMpCandidates(entries = []) {
  return entries.map((entry) => normalizeRemoteCandidate(entry, "skillsmp"));
}

export function discoverGithubTopicCandidates(entries = [], topic = "skill-md") {
  return entries.map((entry) => normalizeRemoteCandidate({ ...entry, topic }, "github"));
}

export function evaluateCandidate(skillFile, sourceType = "local") {
  const metadata = parseSkillMarkdown(skillFile);
  const security = scanSkillPackage(skillFile);
  const quality = scoreSkill(metadata, security);
  return {
    type: sourceType,
    install: false,
    approved: security.passed && quality.total >= 70,
    metadata: { ...metadata, quality_score: quality.total, security: security.passed ? "reviewed" : "blocked" },
    quality,
    security,
    path: path.resolve(skillFile)
  };
}

function normalizeRemoteCandidate(entry, sourceType) {
  return {
    type: sourceType,
    install: false,
    approved: false,
    metadata: {
      id: entry.id || entry.name || entry.repo || "remote-skill",
      name: entry.name || entry.repo || "Remote Skill",
      description: entry.description || "Remote skill candidate awaiting metadata import and security review.",
      category: entry.category || "community",
      author: entry.author || entry.owner || "unknown",
      source: entry.url || entry.source || sourceType,
      repository: entry.repository || entry.url || "",
      license: entry.license || "unknown",
      version: entry.version || "0.0.0",
      compatibility: entry.compatibility || [],
      triggers: entry.triggers || [],
      dependencies: entry.dependencies || [],
      security: "unreviewed",
      quality_score: 0,
      tags: entry.tags || [entry.topic || sourceType],
      files: []
    },
    quality: null,
    security: { passed: false, findings: [{ severity: "medium", message: "Remote candidate requires explicit import review" }] }
  };
}

function collectSkillFiles(root) {
  const files = [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return path.basename(root).toLowerCase() === "skill.md" ? [root] : [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...collectSkillFiles(fullPath));
    else if (entry.name.toLowerCase() === "skill.md") files.push(fullPath);
  }
  return files;
}
