# Security Rules

The v0.2.0 scanner blocks or flags skill packages before installation.

## High Severity

- Credential or API key extraction.
- Password, token, cookie, or secret harvesting.
- Destructive shell commands against home, root, or disks.
- Downloaded scripts piped directly into shell interpreters.
- Hidden shell execution or dynamic code execution.
- Prompt injection attempts such as ignoring previous instructions or overriding system prompts.
- Malicious monitoring such as keylogging or clipboard capture.

## Medium Severity

- Executable script files inside imported packages.
- Suspicious downloads requiring manual review.
- Unsafe automation instructions such as bypassing permission or auto-approving risky work.

## Policy

High severity findings block installation. Medium severity findings lower quality score and require manual review before registry promotion.
