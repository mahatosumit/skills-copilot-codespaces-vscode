# Contributing

## Development Loop

1. Inspect existing code and docs.
2. Create or update a small implementation plan for multi-file changes.
3. Implement the smallest working change.
4. Add or update tests.
5. Run validation.
6. Update documentation and changelog.

## Validation

```bash
npm run validate
```

Before release, also run CLI smoke checks for registry, search, recommendation, import, install, and sync.

## Skill Import Rules

- Do not bulk-import external skill collections.
- Discovery is metadata-first and must not auto-install.
- Treat every external skill as untrusted.
- Review source, license, scripts, permissions, suspicious instructions, and generated security findings before installation.
- Keep curated packs small, verified, and manually maintained.

## Quality Expectations

- Preserve simple module boundaries.
- Add tests for parser, validator, registry, discovery, security, quality, install, sync, and CLI changes.
- Keep generated package output stable unless the schema is intentionally changed.
