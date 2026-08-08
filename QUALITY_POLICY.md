# Quality Policy

Every skill is scored from 0 to 100.

v0.2.0 weights:

- Documentation: 15%
- Maintenance: 15%
- Security: 25%
- Compatibility: 15%
- Technical Quality: 20%
- Community Adoption: 10%

Each import generates `quality-report.json` with score breakdown, security status, findings, and recommendation.

Reject or block skills with:

- Duplicate purpose and lower quality than an existing package.
- Malicious instructions.
- Hidden scripts.
- Credential access requests.
- Unsafe automation.
- Abandoned or unverifiable sources.
- Incompatible licensing.
