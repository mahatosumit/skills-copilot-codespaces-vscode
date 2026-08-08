import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const roots = ["src", "tests"];
const files = roots.flatMap((root) => collect(root)).filter((file) => file.endsWith(".js"));
let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) process.exitCode = 1;
else console.log(`Syntax OK (${files.length} files)`);

function collect(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => collect(path.join(target, entry.name)));
}
