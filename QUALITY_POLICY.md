# Quality Policy

Every skill is scored from 0 to 100.

Weights:

- Documentation: 20%
- Maintenance: 20%
- Security: 20%
- Compatibility: 20%
- Practical usefulness: 20%

Reject or block skills with:

- Duplicate purpose and lower quality than an existing package.
- Malicious instructions.
- Hidden scripts.
- Credential access requests.
- Unsafe automation.
- Abandoned or unverifiable sources.
- Incompatible licensing.

The MVP implements a static quality scorer in `src/quality.js` and static security scanner in `src/security.js`.
