# Implementation Roadmap

## Phase 1: Foundation

Create package configuration, parser, validator, security scanner, quality scorer, importer, exporter, CLI, schema, and docs.

## Phase 2: Skill Registry

Create registry folders and `registry/index.json`. Keep registry metadata-first.

## Phase 3: Import System

Implement local `SKILL.md` import and universal package generation. Defer remote imports until safety and metadata handling are mature.

## Phase 4: Quality Engine

Implement weighted quality scoring and policy documentation.

## Phase 5: Adapters

Implement Codex, OpenCode, Claude Code, GitHub Copilot, and VS Code exporters.

## Phase 6: CLI

Implement `skillx validate`, `skillx import`, `skillx list`, and `skillx export`.

## Phase 7: CI/CD

Add validation, security, registry, and release workflows.

## Phase 8: Release

Add changelog, run validation, commit, and push MVP.
