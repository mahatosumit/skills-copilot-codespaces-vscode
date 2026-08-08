import fs from "node:fs";
import path from "node:path";
import { loadCatalog } from "./catalog.js";
import { loadRegistry } from "./registry.js";

export function searchSkills(query, options = {}) {
  const candidates = loadSearchCandidates(options);
  const queryTokens = tokenize(query);
  return candidates
    .map((candidate) => ({ ...candidate, score: scoreCandidate(queryTokens, candidate) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(options.limit || 10));
}

export function loadSearchCandidates(options = {}) {
  const registry = loadRegistry(options.registry || "registry/index.json");
  const catalog = loadCatalog(options.catalog || "skills/catalog.json");
  const registrySkills = (registry.skills || []).map((skill) => ({ type: "skill", ...skill }));
  const packSkills = (catalog.packs || []).map((pack) => ({ type: "pack", id: pack.id, name: pack.name, description: `${pack.name} ${pack.skills.join(" ")}`, tags: pack.skills, quality_score: 80, compatibility: [] }));
  return [...registrySkills, ...packSkills];
}

function scoreCandidate(queryTokens, candidate) {
  const haystack = tokenize([candidate.id, candidate.name, candidate.description, candidate.category, ...(candidate.tags || []), ...(candidate.skills || [])].join(" "));
  const hay = new Set(haystack);
  let score = 0;
  for (const token of queryTokens) {
    if (hay.has(token)) score += 10;
    for (const item of hay) if (item.includes(token) || token.includes(item)) score += 2;
  }
  score += Math.round(Number(candidate.quality_score || 0) / 20);
  if ((candidate.channel || candidate.status) === "verified") score += 5;
  return score;
}

function tokenize(text) {
  return String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 1 && !stopwords.has(token));
}

const stopwords = new Set(["the", "and", "for", "with", "skill", "pack", "system"]);
