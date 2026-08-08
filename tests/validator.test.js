import test from "node:test";
import assert from "node:assert/strict";
import { parseSkillMarkdown } from "../src/parser.js";
import { validateSkillMetadata } from "../src/validator.js";

test("validates parsed skill metadata", () => {
  const metadata = parseSkillMarkdown("tests/fixtures/sample-skill/SKILL.md");
  const result = validateSkillMetadata(metadata);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("rejects invalid metadata", () => {
  const result = validateSkillMetadata({ id: "Bad ID", compatibility: [] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});
