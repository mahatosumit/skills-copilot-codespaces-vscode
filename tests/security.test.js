import test from "node:test";
import assert from "node:assert/strict";
import { scanSkillPackage } from "../src/security.js";

test("security scan passes sample skill", () => {
  const result = scanSkillPackage("tests/fixtures/sample-skill");
  assert.equal(result.passed, true);
  assert.deepEqual(result.findings, []);
});
