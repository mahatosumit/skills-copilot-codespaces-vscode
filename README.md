# Universal Agent Skill OS

Universal Agent Skill OS is a lightweight skill management system for AI coding agents.

It supports a practical MVP flow:

```text
SKILL.md -> parse -> validate -> quality score -> universal package -> export
```

Supported agent targets:

- OpenAI Codex
- OpenCode
- Claude Code
- GitHub Copilot
- VS Code AI extensions

## Install

```bash
npm install
```

Run the CLI:

```bash
node ./skillx --help
```

## Commands

```bash
skillx validate <path>
skillx import <path> --out skills/packages
skillx list
skillx export <agent> <package-dir> --out .
```

Agents: `codex`, `opencode`, `claude`, `copilot`, `vscode`.

## Example

```bash
node ./skillx import ./tests/fixtures/sample-skill/SKILL.md --out ./tmp/packages
node ./skillx validate ./tmp/packages/sample-skill
node ./skillx export codex ./tmp/packages/sample-skill --out ./tmp/export
```

## Architecture

The MVP is intentionally small:

- `src/parser.js`: extracts metadata from `SKILL.md`.
- `src/validator.js`: validates universal metadata.
- `src/security.js`: flags suspicious instructions and risky files.
- `src/quality.js`: scores documentation, maintenance, security, compatibility, and usefulness.
- `src/importer.js`: creates universal skill packages.
- `src/exporter.js`: exports packages to agent-specific folders.
- `src/cli.js`: powers `skillx`.

See `ARCHITECTURE.md` and `QUALITY_POLICY.md`.

## Skill Package Format

```text
skill-name/
  skill.yaml
  SKILL.md
  README.md
```

The long-term goal is:

```bash
skillx sync-all
```

to configure all supported agents with curated verified skills.
