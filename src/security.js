import fs from "node:fs";
import path from "node:path";
import { readText } from "./utils.js";

export const securityRules = [
  { id: "credential-api-key", severity: "high", pattern: /api[_-]?key/i, description: "Credential or API key reference" },
  { id: "credential-password", severity: "high", pattern: /password/i, description: "Password reference" },
  { id: "credential-token", severity: "high", pattern: /token/i, description: "Token reference" },
  { id: "credential-extraction", severity: "high", pattern: /(steal|extract|harvest|collect).{0,40}(credential|secret|token|cookie|key)/i, description: "Credential extraction instruction" },
  { id: "destructive-rm", severity: "high", pattern: /rm\s+-rf\s+(\/|~|\$HOME|%USERPROFILE%)/i, description: "Destructive remove command" },
  { id: "destructive-format", severity: "high", pattern: /(format\s+[a-z]:|diskpart|mkfs\.)/i, description: "Destructive disk operation" },
  { id: "shell-pipe-download", severity: "high", pattern: /(curl|wget|iwr|Invoke-WebRequest).{0,120}\|\s*(bash|sh|powershell|pwsh|cmd)/i, description: "Downloaded script piped to shell" },
  { id: "hidden-shell-exec", severity: "high", pattern: /(Invoke-Expression|\biex\b|eval\(|new Function\(|child_process\.(exec|spawn|execSync))/i, description: "Hidden shell or dynamic execution" },
  { id: "suspicious-download", severity: "medium", pattern: /((curl|wget|Invoke-WebRequest|downloadstring).{0,120}(http|https):\/\/|(http|https):\/\/.{0,120}(curl|wget|Invoke-WebRequest|downloadstring))/i, description: "Suspicious download instruction" },
  { id: "prompt-injection", severity: "high", pattern: /(ignore previous instructions|override system instructions|developer message|system prompt|exfiltrate)/i, description: "Prompt injection attempt" },
  { id: "unsafe-automation", severity: "medium", pattern: /(auto-approve|without asking|disable safety|bypass permission)/i, description: "Unsafe automation instruction" },
  { id: "keylogger", severity: "high", pattern: /keylogger|clipboard capture|screen scrape/i, description: "Malicious monitoring behavior" }
];

const riskyExtensions = new Set([".exe", ".dll", ".ps1", ".bat", ".cmd", ".sh"]);

export function scanSkillPackage(packagePath) {
  const absolutePath = path.resolve(packagePath);
  const findings = [];
  const files = collectFiles(absolutePath);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (riskyExtensions.has(ext)) findings.push({ ruleId: "risky-file", severity: "medium", file, message: `Risky executable file type: ${ext}` });

    if (isTextFile(file)) {
      const text = readText(file);
      for (const rule of securityRules) {
        if (rule.pattern.test(text)) findings.push({ ruleId: rule.id, severity: rule.severity, file, message: rule.description });
      }
    }
  }

  return {
    passed: findings.filter((finding) => finding.severity === "high").length === 0,
    findings,
    summary: summarize(findings)
  };
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
  return [".md", ".yaml", ".yml", ".json", ".txt", ".js", ".ts", ".mjs"].includes(path.extname(file).toLowerCase());
}

function summarize(findings) {
  return findings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {});
}
