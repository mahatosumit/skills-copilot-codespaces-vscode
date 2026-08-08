import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("skillx validate succeeds for sample skill", () => {
  const result = spawnSync(process.execPath, ["./skillx", "validate", "tests/fixtures/sample-skill/SKILL.md"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /"valid": true/);
});

test("skillx list prints catalog", () => {
  const result = spawnSync(process.execPath, ["./skillx", "list"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Engineering Pack/);
});
