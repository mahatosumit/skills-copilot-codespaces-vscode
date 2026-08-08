# Implementation Plan

## Current Repository Analysis

The repository was empty except for a placeholder README. There were no existing frameworks, package managers, tests, CI workflows, skill formats, or documentation to preserve.

## Architecture Proposal

Build a dependency-free Node.js MVP centered on:

- `SKILL.md` parser.
- Universal metadata schema.
- Validator.
- Static security scanner.
- Quality scorer.
- Importer that creates universal skill packages.
- Exporter for Codex, OpenCode, Claude Code, Copilot, and VS Code.
- `skillx` CLI.
- Tests with built-in `node:test`.

## Files To Create

- `package.json`
- `skillx`
- `src/*.js`
- `schema/skill.schema.json`
- `registry/index.json`
- `tools/discovery/README.md`
- `QUALITY_POLICY.md`
- `SECURITY_POLICY.md`
- `skills/catalog.json`
- `packs/*/pack.json`
- `adapters/README.md`
- `.github/workflows/*.yml`
- `tests/*.test.js`
- project documentation

## Files To Modify

- Replace placeholder `README.md`.

## Migration Strategy

No migration is required because no previous implementation exists. The new MVP is additive except for replacing the placeholder README.
