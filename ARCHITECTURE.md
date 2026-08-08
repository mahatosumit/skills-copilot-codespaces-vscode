# Architecture

Universal Agent Skill OS is a local-first intelligence layer for AI agent skills. It turns `SKILL.md` files into reviewed universal packages, records registry metadata, recommends relevant skills, and syncs verified content into multiple agent runtimes.

## Lifecycle

```text
Discover -> Parse -> Validate -> Security Scan -> Quality Score -> Approve -> Install -> Sync
```

The lifecycle is deliberately explicit. Discovery creates candidates only. Installation requires verified packs or reviewed packages.

## Core Modules

- `src/parser.js`: parses `SKILL.md` frontmatter, Markdown fallback metadata, and generated `skill.yaml` files.
- `src/validator.js`: validates required universal skill metadata.
- `src/security.js`: scans packages for suspicious instructions, risky files, destructive commands, credential extraction, prompt injection, and hidden execution.
- `src/quality.js`: calculates weighted v0.2.0 quality scores and builds `quality-report.json`.
- `src/importer.js`: creates universal package folders containing `skill.yaml`, `SKILL.md`, `README.md`, and `quality-report.json`.
- `src/exporter.js`: exports reviewed packages to Codex, OpenCode, Claude Code, GitHub Copilot, and VS Code layouts.
- `src/registry.js`: loads, validates, and normalizes registry entries.
- `src/discovery/index.js`: discovers local skills and represents remote SkillsMP/GitHub candidates without auto-installing.
- `src/search.js`: provides lightweight local semantic search over registry entries and curated packs.
- `src/profile.js`: loads user profiles and returns profile-based recommendations.
- `src/installer.js`: installs only verified packs or reviewed packages into a workspace inventory.
- `src/sync.js`: syncs installed packages to supported agent folders.
- `src/cli.js`: exposes the `skillx` command surface.

## Data Layout

```text
registry/index.json        Registry metadata and channels
skills/catalog.json        Verified curated packs
profiles/sumit.yaml        Recommendation profile
schema/skill.schema.json   Universal metadata schema
packs/*/pack.json          Curated pack definitions
```

Generated package:

```text
skill-name/
  skill.yaml
  SKILL.md
  README.md
  quality-report.json
```

Installed workspace state:

```text
.skillx/
  skills/<id>/<version>/
  packs/<id>/pack.json
```

Synced agent targets:

```text
.codex/skills/
.opencode/skills/
.claude/skills/
.github/copilot/
.vscode/skills/
```

## Design Constraints

- Keep the platform dependency-free and easy to run in constrained agent environments.
- Prefer explicit review over automatic remote import.
- Preserve a small module boundary for parser, validator, scanner, quality, registry, install, and sync behavior.
- Treat external skills as untrusted until validation and security checks complete.
