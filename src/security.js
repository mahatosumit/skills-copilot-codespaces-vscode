import fs from "node:fs";
import path from "node:path";
import { readText } from "./utils.js";

const suspiciousPatterns = [/api[_-]?key/i, /password/i, /token/i, /credential/i, /rm\s+-rf/i, /curl\s+.*\|\s*(bash|sh|powershell)/i, /Invoke-Expression/i, /downloadstring/i, /exfiltrate/i, /keylogger/i];
const riskyExtensions = new Set([".exe", ".dll", ".ps1", ".bat", ".cmd", ".sh"]);

export function scanSkillPackage(packagePath) {
  const absolutePath = path.resolve(packagePath);
  const findings = [];
  const files = collectFiles(absolutePath);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (riskyExtensions.has(ext)) findings.push({ severity: "medium", file, message: `Risky executable file type: ${ext}` });

    if (isTextFile(file)) {
      const text = readText(file);
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) findings.push({ severity: "high", file, message: `Suspicious pattern: ${pattern}` });
      }
    }
  }

  return { passed: findings.filter((finding) => finding.severity === "high").length === 0, findings };
}

function collectFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return [targetPath];
  const files = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function isTextFile(file) {
  return [".md", ".yaml", ".yml", ".json", ".txt", ".js", ".ts"].includes(path.extname(file).toLowerCase());
}
