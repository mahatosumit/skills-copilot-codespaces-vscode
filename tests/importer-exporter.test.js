import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { importSkill } from "../src/importer.js";
import { exportSkillPackage } from "../src/exporter.js";

test("imports a SKILL.md into a universal package", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skillx-import-"));
  const result = importSkill("tests/fixtures/sample-skill/SKILL.md", { out: tmp });
  assert.ok(fs.existsSync(path.join(result.packageDir, "skill.yaml")));
  assert.ok(fs.existsSync(path.join(result.packageDir, "SKILL.md")));
  assert.ok(fs.existsSync(path.join(result.packageDir, "README.md")));
  assert.ok(result.metadata.quality_score > 0);
});

test("exports a package to a Codex target directory", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skillx-export-"));
  const imported = importSkill("tests/fixtures/sample-skill/SKILL.md", { out: path.join(tmp, "packages") });
  const exported = exportSkillPackage("codex", imported.packageDir, { out: path.join(tmp, "workspace") });
  assert.ok(exported.destination.endsWith(path.join(".codex", "skills", "sample-skill")));
  assert.ok(fs.existsSync(path.join(exported.destination, "SKILL.md")));
});

test("validates generated package metadata", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skillx-package-"));
  const imported = importSkill("tests/fixtures/sample-skill/SKILL.md", { out: tmp });
  const metadata = JSON.parse(JSON.stringify(imported.metadata));
  assert.equal(metadata.quality_score, 92);
});
