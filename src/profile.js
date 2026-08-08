import fs from "node:fs";
import path from "node:path";
import { parseSimpleYaml } from "./yaml.js";
import { readText } from "./utils.js";
import { searchSkills } from "./search.js";

export function loadProfile(nameOrPath) {
  const file = fs.existsSync(nameOrPath) ? nameOrPath : path.join("profiles", `${nameOrPath}.yaml`);
  const data = parseSimpleYaml(readText(file));
  return {
    id: data.id || path.basename(file, path.extname(file)),
    name: data.name || data.id || "profile",
    recommendation_focus: Array.isArray(data.recommendation_focus) ? data.recommendation_focus : [],
    preferred_packs: Array.isArray(data.preferred_packs) ? data.preferred_packs : []
  };
}

export function recommendForProfile(profileName, options = {}) {
  const profile = loadProfile(profileName);
  const query = [...profile.recommendation_focus, ...profile.preferred_packs].join(" ");
  return { profile, recommendations: searchSkills(query, options) };
}
