# Adapters

Export adapters write universal skill packages to agent-specific directories:

- Codex: `.codex/skills/`
- OpenCode: `.opencode/skills/`
- Claude Code: `.claude/skills/`
- GitHub Copilot: `.github/copilot/`
- VS Code: `.vscode/skills/`

Use:

```bash
skillx export codex <package-dir> --out <workspace>
```
