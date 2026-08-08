import fs from "node:fs";
import path from "node:path";
import { parseSkillPackage } from "./parser.js";
import { readJson, writeJson } from "./utils.js";
import { validateSkillMetadata } from "./validator.js";

export const registryChannels = ["verified", "community", "experimental", "deprecated"];

export function loadRegistry(registryPath = "registry/index.json") {
  const absolutePath = path.resolve(registryPath);
  if (!fs.existsSync(absolutePath)) return emptyRegistry();
  return readJson(absolutePath);
}

export function validateRegistry(registryPath = "registry/index.json") {
  const registry = loadRegistry(registryPath);
  const errors = [];
  const warnings = [];
  const ids = new Set();

  if (!registry.version) errors.push("registry.version is required");
  if (!Array.isArray(registry.skills)) errors.push("registry.skills must be an array");

  for (const channel of registryChannels) {
    if (!registry.channels?.[channel]) warnings.push(`Missing channel path: ${channel}`);
  }

  for (const skill of registry.skills || []) {
    if (ids.has(skill.id)) errors.push(`Duplicate skill id: ${skill.id}`);
    ids.add(skill.id);
    const result = validateSkillMetadata(normalizeRegistrySkill(skill));
    for (const error of result.errors) errors.push(`${skill.id || "unknown"}: ${error}`);
    if (!registryChannels.includes(skill.channel || "verified")) errors.push(`${skill.id}: unsupported channel ${skill.channel}`);
    if (!skill.versions || !Array.isArray(skill.versions) || skill.versions.length === 0) errors.push(`${skill.id}: versions must be a non-empty array`);
  }

  return { valid: errors.length === 0, errors, warnings, skills: (registry.skills || []).length };
}

export function addRegistrySkill(skill, registryPath = "registry/index.json") {
  const registry = loadRegistry(registryPath);
  registry.skills = registry.skills || [];
  const index = registry.skills.findIndex((entry) => entry.id === skill.id);
  if (index === -1) registry.skills.push(skill);
  else registry.skills[index] = skill;
  registry.updated = new Date().toISOString().slice(0, 10);
  writeJson(registryPath, registry);
  return registry;
}

export function packageToRegistrySkill(packagePath, channel = "verified") {
  const metadata = parseSkillPackage(packagePath);
  return {
    ...metadata,
    channel,
    versions: [metadata.version],
    source_repository: metadata.repository || metadata.source,
    security_status: metadata.security,
    popularity: metadata.popularity || { stars: 0, downloads: 0, dependents: 0 }
  };
}

function normalizeRegistrySkill(skill) {
  return {
    ...skill,
    files: skill.files || ["SKILL.md"],
    security: skill.security || skill.security_status || "review-required",
    quality_score: Number(skill.quality_score || 0),
    compatibility: skill.compatibility || [],
    triggers: skill.triggers || [],
    dependencies: skill.dependencies || [],
    tags: skill.tags || []
  };
}

function emptyRegistry() {
  return { version: "1.0.0", updated: new Date().toISOString().slice(0, 10), skills: [], channels: Object.fromEntries(registryChannels.map((channel) => [channel, `registry/${channel}`])) };
}
