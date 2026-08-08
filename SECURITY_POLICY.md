# Security Policy

## Supported Scope

This repository validates, packages, installs, and syncs AI agent skills. Skills may contain instructions, scripts, examples, and adapters, so all imports must be treated as untrusted.

## Import Security Checks

Before importing any external skill, check:

- Source URL or local path.
- License.
- Scripts and executable files.
- Permission requests.
- Suspicious instructions.
- Credential access.
- Prompt injection attempts.

## Scanner Coverage

The v0.2.0 scanner detects or flags:

- Hidden shell execution and dynamic code execution.
- Credential, token, cookie, password, or key extraction.
- Suspicious downloads, including downloader commands near URLs.
- Downloaded scripts piped directly into shell interpreters.
- Destructive file or disk commands.
- Malicious monitoring instructions.
- Unsafe automation instructions.
- Prompt injection attempts.

See `SECURITY_RULES.md` for the rule list.

## Install Policy

`skillx install` rejects unverified skill packages. High severity findings block installation. Medium severity findings lower the quality score and require manual review before promotion into verified channels.

## Reporting

Open an issue with the skill source, suspicious file, observed behavior, expected safe behavior, and scanner output.
