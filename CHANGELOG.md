# Changelog

## v0.2.0 - 2026-08-08

- Added advanced registry validation with versions, source, author, license, compatibility, dependencies, changelog, quality, security, channel, and popularity metadata.
- Added metadata-first discovery for local skills, SkillsMP-style entries, and GitHub skill topic candidates.
- Added v0.2.0 quality engine weights and generated `quality-report.json` files.
- Hardened security scanning for hidden shell execution, credential extraction, suspicious downloads, destructive commands, malicious monitoring, unsafe automation, and prompt injection.
- Added local semantic search through `skillx search`.
- Added `profiles/sumit.yaml` and `skillx recommend --profile sumit`.
- Added verified-only installation with `skillx install` and installed inventory via `skillx installed`.
- Added multi-agent sync to Codex, OpenCode, Claude Code, GitHub Copilot, and VS Code.
- Expanded test coverage to registry, discovery, security, quality scoring, profiles, install, sync, and CLI workflows.
- Updated README, installation, architecture, quality, and security documentation.

## v0.1.0 - 2026-08-08

- Implemented dependency-free Node.js MVP for Universal Agent Skill OS.
- Added `skillx` CLI with validate, import, list, and export commands.
- Added parser, validator, security scanner, quality scorer, importer, and exporter modules.
- Added universal skill schema.
- Added registry channels and curated verified packs.
- Added documentation, CI workflows, and tests.
