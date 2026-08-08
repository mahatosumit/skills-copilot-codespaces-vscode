export function scoreSkill(metadata, securityScan = { findings: [] }) {
  const documentation = clamp(scoreDocumentation(metadata));
  const maintenance = clamp(scoreMaintenance(metadata));
  const security = clamp(scoreSecurity(securityScan));
  const compatibility = clamp(scoreCompatibility(metadata));
  const usefulness = clamp(scoreUsefulness(metadata));
  const total = Math.round(documentation * 0.2 + maintenance * 0.2 + security * 0.2 + compatibility * 0.2 + usefulness * 0.2);
  return { total, breakdown: { documentation, maintenance, security, compatibility, usefulness } };
}

function scoreDocumentation(metadata) {
  let score = 40;
  if (metadata.description?.length >= 80) score += 25;
  if (metadata.contentLength >= 300) score += 25;
  if (metadata.triggers?.length) score += 10;
  return score;
}

function scoreMaintenance(metadata) {
  let score = 50;
  if (metadata.version && metadata.version !== "0.1.0") score += 20;
  if (metadata.license && metadata.license !== "unknown") score += 20;
  if (metadata.author && metadata.author !== "unknown") score += 10;
  return score;
}

function scoreSecurity(scan) {
  let score = 100;
  for (const finding of scan.findings || []) score -= finding.severity === "high" ? 35 : 15;
  return score;
}

function scoreCompatibility(metadata) {
  return 30 + Math.min(metadata.compatibility?.length || 0, 5) * 14;
}

function scoreUsefulness(metadata) {
  let score = 40;
  if (metadata.category && metadata.category !== "general") score += 20;
  if (metadata.tags?.length) score += 20;
  if (metadata.name && metadata.description) score += 20;
  return score;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
