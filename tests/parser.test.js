import test from "node:test";
import assert from "node:assert/strict";
import { parseSkillMarkdown } from "../src/parser.js";

test("parses SKILL.md frontmatter into universal metadata", () => {
  const metadata = parseSkillMarkdown("tests/fixtures/sample-skill/SKILL.md");
  assert.equal(metadata.id, "sample-skill");
  assert.equal(metadata.name, "sample-skill");
  assert.equal(metadata.category, "engineering");
  assert.ok(metadata.compatibility.includes("codex"));
  assert.ok(metadata.description.includes("sample skill"));
});
