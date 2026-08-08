import fs from "node:fs";
import path from "node:path";
import { loadCatalog } from "./catalog.js";
import { discoverGithubTopicCandidates, discoverLocalSkills, discoverSkillsMpCandidates } from "./discovery/index.js";
import { exportSkillPackage, exportTargets } from "./exporter.js";
import { importSkill } from "./importer.js";
import { installPackage, listInstalled } from "./installer.js";
import { parseSkillPackage } from "./parser.js";
import { recommendForProfile } from "./profile.js";
import { validateRegistry } from "./registry.js";
import { scanSkillPackage } from "./security.js";
import { searchSkills } from "./search.js";
import { syncAgents } from "./sync.js";
import { validateSkillMetadata } from "./validator.js";

export async function runCli(args) {
  const [command, ...rest] = args;
  switch (command) {
    case "validate": return validateCommand(rest);
    case "import": return importCommand(rest);
    case "list": return listCommand(rest);
    case "export": return exportCommand(rest);
    case "registry": return registryCommand(rest);
    case "discover": return discoverCommand(rest);
    case "search": return searchCommand(rest);
    case "recommend": return recommendCommand(rest);
    case "install": return installCommand(rest);
    case "installed": return installedCommand(rest);
    case "sync": return syncCommand(rest);
    case "--help":
    case "-h":
    case undefined: return help();
    default: throw new Error(`Unknown command: ${command}\nRun skillx --help`);
  }
}

function validateCommand(args) {
  const target = args[0] || ".";
  const metadata = parseSkillPackage(target);
  const securityTarget = fs.statSync(target).isDirectory() ? target : path.dirname(target);
  const scan = scanSkillPackage(securityTarget);
  const validation = validateSkillMetadata(metadata);
  if (!validation.valid || !scan.passed) {
    console.log(JSON.stringify({ valid: false, errors: validation.errors, security: scan }, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify({ valid: true, metadata, security: scan }, null, 2));
}

function importCommand(args) {
  const source = args[0];
  if (!source) throw new Error("Usage: skillx import <path> [--out <dir>]");
  const out = optionValue(args, "--out") || "skills/packages";
  console.log(JSON.stringify(importSkill(source, { out }), null, 2));
}

function listCommand(args) {
  const catalogPath = optionValue(args, "--catalog") || "skills/catalog.json";
  console.log(JSON.stringify(loadCatalog(catalogPath), null, 2));
}

function exportCommand(args) {
  const agent = args[0];
  const packageDir = args[1];
  if (!agent || !packageDir) throw new Error(`Usage: skillx export <${Object.keys(exportTargets).join("|")}> <package-dir> [--out <dir>]`);
  const out = optionValue(args, "--out") || ".";
  console.log(JSON.stringify(exportSkillPackage(agent, packageDir, { out }), null, 2));
}

function registryCommand(args) {
  if (args[0] !== "validate") throw new Error("Usage: skillx registry validate [registry/index.json]");
  const registryPath = args[1] || "registry/index.json";
  const result = validateRegistry(registryPath);
  if (!result.valid) process.exitCode = 1;
  console.log(JSON.stringify(result, null, 2));
}

function discoverCommand(args) {
  const source = args[0] || "local";
  if (source === "local") {
    const root = args[1] || ".";
    console.log(JSON.stringify({ candidates: discoverLocalSkills(root) }, null, 2));
    return;
  }
  if (source === "skillsmp") {
    console.log(JSON.stringify({ candidates: discoverSkillsMpCandidates([]), note: "Provide SkillsMP metadata entries through API integration before import." }, null, 2));
    return;
  }
  if (source === "github") {
    console.log(JSON.stringify({ candidates: discoverGithubTopicCandidates([], optionValue(args, "--topic") || "skill-md"), note: "GitHub discovery is metadata-only until explicit import." }, null, 2));
    return;
  }
  throw new Error("Usage: skillx discover <local|skillsmp|github> [path]");
}

function searchCommand(args) {
  const query = args.join(" ").trim();
  if (!query) throw new Error("Usage: skillx search <query>");
  console.log(JSON.stringify({ query, results: searchSkills(query) }, null, 2));
}

function recommendCommand(args) {
  const profile = optionValue(args, "--profile") || args[0];
  if (!profile) throw new Error("Usage: skillx recommend --profile <name>");
  console.log(JSON.stringify(recommendForProfile(profile), null, 2));
}

function installCommand(args) {
  const target = args[0];
  if (!target) throw new Error("Usage: skillx install <package-dir|verified-pack> [--workspace <dir>] [--version <version>]");
  const workspace = optionValue(args, "--workspace") || ".";
  const version = optionValue(args, "--version");
  console.log(JSON.stringify(installPackage(target, { workspace, version }), null, 2));
}

function installedCommand(args) {
  const workspace = optionValue(args, "--workspace") || ".";
  console.log(JSON.stringify({ installed: listInstalled(workspace) }, null, 2));
}

function syncCommand(args) {
  const workspace = optionValue(args, "--workspace") || ".";
  const agent = optionValue(args, "--agent") || "all";
  console.log(JSON.stringify(syncAgents({ workspace, agent }), null, 2));
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function help() {
  console.log(`skillx - Universal Agent Skill OS\n\nCommands:\n  skillx validate <path>\n  skillx import <path> --out <dir>\n  skillx list [--catalog <path>]\n  skillx registry validate [registry/index.json]\n  skillx discover local <path>\n  skillx search <query>\n  skillx recommend --profile <name>\n  skillx install <package-dir|verified-pack> --workspace <dir>\n  skillx installed --workspace <dir>\n  skillx export <agent> <package-dir> --out <dir>\n  skillx sync --workspace <dir> --agent <agent|all>\n\nAgents:\n  ${Object.keys(exportTargets).join(", ")}\n`);
}
