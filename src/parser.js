import fs from "node:fs";
import path from "node:path";
import { parseSimpleYaml } from "./yaml.js";
import { normalizeList, readText, slugify } from "./utils.js";

const defaultCompatibility = ["codex", "opencode", "claude-code", "copilot"];

export function parseSkillMarkdown(filePath) {
  const absolutePath = path.resolve(filePath);
  const markdown = readText(absolutePath);
  const frontmatter = extractFrontmatter(markdown);
  const body = frontmatter.body;
  const metadata = frontmatter.data;

  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const name = metadata.name || heading || path.basename(path.dirname(absolutePath));
  const description = metadata.description || firstParagraph(body) || `Skill package for ${name}.`;
  const id = metadata.id || slugify(name);

  return normalizeMetadata({
    id,
    name,
    description,
    category: metadata.category || inferCategory(body, description),
    author: metadata.author || "unknown",
    source: metadata.source || "local",
    repository: metadata.repository || metadata.source_repository || "",
    license: metadata.license || "unknown",
    version: String(metadata.version || "0.1.0"),
    compatibility: normalizeList(metadata.compatibility).length ? normalizeList(metadata.compatibility) : defaultCompatibility,
    triggers: normalizeList(metadata.triggers),
    dependencies: normalizeList(metadata.dependencies),
    security: metadata.security || "review-required",
    quality_score: Number(metadata.quality_score || 0),
    tags: normalizeList(metadata.tags),
    changelog: normalizeList(metadata.changelog),
    popularity: parsePopularity(metadata),
    files: ["SKILL.md"],
    contentLength: body.trim().length,
    path: absolutePath
  });
}

export function parseSkillPackage(packagePath) {
  const absolutePath = path.resolve(packagePath);
  const stat = fs.statSync(absolutePath);

  if (stat.isDirectory()) {
    const metadataFile = path.join(absolutePath, "skill.yaml");
    if (fs.existsSync(metadataFile)) return parseSkillYaml(metadataFile);
    const skillMarkdown = path.join(absolutePath, "SKILL.md");
    if (fs.existsSync(skillMarkdown)) return parseSkillMarkdown(skillMarkdown);
    throw new Error(`No skill.yaml or SKILL.md found at ${packagePath}`);
  }

  if (path.basename(absolutePath).toLowerCase() === "skill.yaml") return parseSkillYaml(absolutePath);
  return parseSkillMarkdown(absolutePath);
}

export function parseSkillYaml(filePath) {
  const absolutePath = path.resolve(filePath);
  const metadata = parseSimpleYaml(readText(absolutePath));
  return normalizeMetadata({ ...metadata, path: absolutePath });
}

function normalizeMetadata(metadata) {
  return {
    ...metadata,
    id: slugify(metadata.id || metadata.name),
    name: metadata.name || metadata.id || "skill",
    description: metadata.description || "Universal skill package metadata.",
    category: metadata.category || "general",
    author: metadata.author || "unknown",
    source: metadata.source || "local",
    repository: metadata.repository || metadata.source_repository || "",
    license: metadata.license || "unknown",
    version: String(metadata.version || "0.1.0"),
    compatibility: normalizeList(metadata.compatibility).length ? normalizeList(metadata.compatibility) : defaultCompatibility,
    triggers: normalizeList(metadata.triggers),
    dependencies: normalizeList(metadata.dependencies),
    security: metadata.security || "review-required",
    quality_score: Number(metadata.quality_score || 0),
    tags: normalizeList(metadata.tags),
    changelog: normalizeList(metadata.changelog),
    popularity: metadata.popularity && typeof metadata.popularity === "object" ? metadata.popularity : parsePopularity(metadata),
    files: normalizeList(metadata.files).length ? normalizeList(metadata.files) : ["SKILL.md"]
  };
}

function parsePopularity(metadata) {
  return {
    stars: Number(metadata.stars || 0),
    downloads: Number(metadata.downloads || 0),
    dependents: Number(metadata.dependents || 0)
  };
}

function extractFrontmatter(markdown) {
  if (!markdown.startsWith("---")) return { data: {}, body: markdown };
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: markdown };
  const yaml = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).trimStart();
  return { data: parseSimpleYaml(yaml), body };
}

function firstParagraph(markdown) {
  return markdown.replace(/^#.+$/gm, "").split(/\n\s*\n/).map((block) => block.trim()).find((block) => block && !block.startsWith("```"));
}

function inferCategory(body, description) {
  const text = `${body} ${description}`.toLowerCase();
  if (text.includes("rag") || text.includes("llm") || text.includes("agent")) return "ai-engineering";
  if (text.includes("react") || text.includes("ui") || text.includes("frontend")) return "frontend";
  if (text.includes("security") || text.includes("threat")) return "security";
  if (text.includes("robot") || text.includes("ros")) return "robotics";
  if (text.includes("test") || text.includes("debug")) return "engineering";
  return "general";
}
