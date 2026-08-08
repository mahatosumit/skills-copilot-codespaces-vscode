# Security Policy

## Supported Scope

This repository validates and packages AI agent skills. Skills may contain instructions, scripts, examples, and adapters, so all imports must be treated as untrusted.

## Import Security Checks

Before importing any external skill, check:

- Source URL or local path.
- License.
- Scripts and executable files.
- Permission requests.
- Suspicious instructions.
- Credential access.

## MVP Scanner

The MVP scanner blocks high-risk textual patterns such as credential harvesting, shell pipe execution, destructive deletion, and suspicious automation language.

## Reporting

Open an issue with skill source, suspicious file, observed behavior, and expected safe behavior.
