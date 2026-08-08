# Installation

## Requirements

- Node.js 20 or newer.
- npm.

No runtime dependencies are required for v0.2.0.

## Local Setup

```bash
npm install
npm run validate
```

## Run The CLI

From the repository checkout:

```bash
node ./skillx --help
```

Optional local link:

```bash
npm link
skillx --help
```

## Smoke Test

```bash
skillx registry validate
skillx search "autonomous driving perception"
skillx recommend --profile sumit
skillx import tests/fixtures/sample-skill/SKILL.md --out tmp/packages
skillx install tmp/packages/sample-skill --workspace tmp/workspace --version 1.0.0
skillx sync --workspace tmp/workspace
```

## Agent Targets

`skillx export` and `skillx sync` write reviewed skills to these folders:

- `.codex/skills/`
- `.opencode/skills/`
- `.claude/skills/`
- `.github/copilot/`
- `.vscode/skills/`

## Safety Defaults

- Discovery does not install anything.
- Remote candidates are marked unreviewed.
- `skillx install` rejects unverified skill packages.
- High severity security findings block installation.
