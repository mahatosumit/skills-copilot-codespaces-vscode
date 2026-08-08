import fs from "node:fs";
import path from "node:path";
import { loadCatalog } from "./catalog.js";
import { exportSkillPackage, exportTargets } from "./exporter.js";
import { importSkill } from "./importer.js";
import { parseSkillPackage } from "./parser.js";
import { scanSkillPackage } from "./security.js";
import { validateSkillMetadata } from "./validator.js";

export async function runCli(args) {
  const [command, ...rest] = args;
  switch (command) {
    case "validate": return validateCommand(rest);
    case "import": return importCommand(rest);
    case "list": return listCommand(rest);
    case "export": return exportCommand(rest);
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

function optionValue(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function help() {
  console.log(`skillx - Universal Agent Skill OS\n\nCommands:\n  skillx validate <path>\n  skillx import <path> --out <dir>\n  skillx list [--catalog <path>]\n  skillx export <agent> <package-dir> --out <dir>\n\nAgents:\n  ${Object.keys(exportTargets).join(", ")}\n`);
}
