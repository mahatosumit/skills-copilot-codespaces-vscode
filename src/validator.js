const requiredFields = [
  "id", "name", "description", "category", "author", "source", "license", "version", "compatibility", "triggers", "dependencies", "security", "quality_score", "tags", "files"
];

const supportedAgents = new Set(["codex", "opencode", "claude-code", "copilot", "vscode", "mcp"]);

export function validateSkillMetadata(metadata) {
  const errors = [];

  for (const field of requiredFields) {
    if (!(field in metadata)) errors.push(`Missing required field: ${field}`);
  }

  if (metadata.id && !/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(metadata.id)) errors.push("id must be lowercase kebab-case");
  if (!metadata.description || metadata.description.length < 20) errors.push("description must be at least 20 characters");

  if (!Array.isArray(metadata.compatibility) || metadata.compatibility.length === 0) {
    errors.push("compatibility must include at least one agent");
  } else {
    for (const agent of metadata.compatibility) {
      if (!supportedAgents.has(agent)) errors.push(`Unsupported compatibility target: ${agent}`);
    }
  }

  if (!Array.isArray(metadata.files) || !metadata.files.includes("SKILL.md")) errors.push("files must include SKILL.md");

  const score = Number(metadata.quality_score);
  if (Number.isNaN(score) || score < 0 || score > 100) errors.push("quality_score must be a number from 0 to 100");

  return { valid: errors.length === 0, errors };
}
