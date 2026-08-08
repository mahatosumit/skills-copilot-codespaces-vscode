# Architecture

Universal Agent Skill OS provides the foundation for skill discovery, validation, packaging, and export.

## Current Repository Reality

The repository started with only a README, so this implementation creates a dependency-free Node.js MVP.

## Core Flow

```text
SKILL.md -> parser -> metadata extraction -> validation -> security scan -> quality scoring -> universal skill package -> exporter
```

## Modules

- `src/parser.js`: parses frontmatter and Markdown fallback metadata.
- `src/validator.js`: validates universal skill metadata.
- `src/security.js`: scans for suspicious patterns and risky executable files.
- `src/quality.js`: calculates quality score using the policy weights.
- `src/importer.js`: creates package folders with `skill.yaml`, `SKILL.md`, and `README.md`.
- `src/exporter.js`: exports packages into agent-specific directories.
- `src/cli.js`: implements `skillx`.
- `schema/skill.schema.json`: documents the universal skill schema.
- `registry/`: stores registry index and channels.
- `skills/catalog.json`: defines verified curated packs.

## MVP Boundary

This release intentionally does not auto-import remote skills. Remote discovery should be added after local import, validation, quality scoring, and export are stable.
