# Universal Agent Skill OS

Universal Agent Skill OS is a local-first platform for discovering, reviewing, packaging, installing, and syncing AI agent skills across Codex, OpenCode, Claude Code, GitHub Copilot, and VS Code.

The v0.2.0 flow is intentionally conservative:

```text
Discover -> Parse -> Validate -> Security Scan -> Quality Score -> Approve -> Install -> Sync
```

Discovery never installs skills automatically. Only verified packs and reviewed packages can be installed.

## Install

```bash
npm install
```

Run the CLI locally:

```bash
node ./skillx --help
```

Or link it as `skillx` from this checkout:

```bash
npm link
skillx --help
```

## Commands

```bash
skillx validate <path>
skillx import <SKILL.md> --out skills/packages
skillx list
skillx registry validate [registry/index.json]
skillx discover local <path>
skillx discover github --topic skill-md
skillx discover skillsmp
skillx search "autonomous driving perception"
skillx recommend --profile sumit
skillx install <package-dir|verified-pack> --workspace <dir> [--version <version>]
skillx installed --workspace <dir>
skillx export <codex|opencode|claude|copilot|vscode> <package-dir> --out <dir>
skillx sync --workspace <dir> [--agent <agent|all>]
```

## MVP Package Format

```text
skill-name/
  skill.yaml
  SKILL.md
  README.md
  quality-report.json
```

`skill.yaml` stores normalized metadata. `quality-report.json` records the weighted score, security findings, and approval recommendation.

## Registry

The registry supports metadata needed for long-lived agent skill management:

- id, name, description, category, tags
- versions, source repository, author, license
- compatibility, dependencies, changelog
- quality score, security status, channel
- popularity metadata

Validate it with:

```bash
skillx registry validate
```

## Discovery

`src/discovery/` supports metadata-first discovery from:

- local skill folders
- SkillsMP-style entries
- GitHub repositories using skill-related topics such as `skill-md` and `skillsmp`

Remote discovery returns candidates only. Import and install remain explicit review steps.

## Quality And Security

Quality scoring uses these v0.2.0 weights:

- Documentation: 15%
- Maintenance: 15%
- Security: 25%
- Compatibility: 15%
- Technical Quality: 20%
- Community Adoption: 10%

Security checks flag hidden shell execution, credential extraction, suspicious downloads, destructive commands, malicious monitoring, unsafe automation, and prompt injection attempts. See `SECURITY_RULES.md` and `QUALITY_POLICY.md`.

## Profiles

Profiles personalize recommendations. The included `profiles/sumit.yaml` focuses on robotics, autonomous vehicles, ADAS, AI agents, embedded systems, research, and startup work.

```bash
skillx recommend --profile sumit
```

## Adapters

Export and sync targets:

- Codex: `.codex/skills/`
- OpenCode: `.opencode/skills/`
- Claude Code: `.claude/skills/`
- GitHub Copilot: `.github/copilot/`
- VS Code: `.vscode/skills/`

## Validation

```bash
npm run validate
```

The validation command runs syntax checks and the Node.js test suite.
