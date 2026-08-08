export const qualityWeights = {
  documentation: 0.15,
  maintenance: 0.15,
  security: 0.25,
  compatibility: 0.15,
  technicalQuality: 0.20,
  communityAdoption: 0.10
};

export function scoreSkill(metadata, securityScan = { findings: [] }) {
  const breakdown = {
    documentation: clamp(scoreDocumentation(metadata)),
    maintenance: clamp(scoreMaintenance(metadata)),
    security: clamp(scoreSecurity(securityScan)),
    compatibility: clamp(scoreCompatibility(metadata)),
    technicalQuality: clamp(scoreTechnicalQuality(metadata)),
    communityAdoption: clamp(scoreCommunityAdoption(metadata))
  };

  const total = Math.round(Object.entries(breakdown).reduce((sum, [key, value]) => sum + value * qualityWeights[key], 0));
  return { total, breakdown, weights: qualityWeights };
}

export function buildQualityReport(metadata, securityScan) {
  const score = scoreSkill(metadata, securityScan);
  return {
    id: metadata.id,
    version: metadata.version,
    generated_at: new Date().toISOString(),
    quality_score: score.total,
    breakdown: score.breakdown,
    weights: score.weights,
    security_status: securityScan.passed ? "passed" : "blocked",
    findings: securityScan.findings || [],
    recommendation: score.total >= 80 && securityScan.passed ? "approve" : score.total >= 60 && securityScan.passed ? "review" : "reject"
  };
}

function scoreDocumentation(metadata) {
  let score = 35;
  if (metadata.description?.length >= 80) score += 25;
  if (metadata.contentLength >= 300) score += 20;
  if (metadata.triggers?.length) score += 10;
  if (metadata.files?.includes("README.md")) score += 10;
  return score;
}

function scoreMaintenance(metadata) {
  let score = 40;
  if (metadata.version && metadata.version !== "0.1.0") score += 20;
  if (metadata.license && metadata.license !== "unknown") score += 20;
  if (metadata.author && metadata.author !== "unknown") score += 10;
  if (metadata.changelog?.length) score += 10;
  return score;
}

function scoreSecurity(scan) {
  let score = 100;
  for (const finding of scan.findings || []) score -= finding.severity === "high" ? 35 : 15;
  return score;
}

function scoreCompatibility(metadata) {
  return 25 + Math.min(metadata.compatibility?.length || 0, 6) * 12.5;
}

function scoreTechnicalQuality(metadata) {
  let score = 45;
  if (metadata.category && metadata.category !== "general") score += 15;
  if (metadata.dependencies && Array.isArray(metadata.dependencies)) score += 10;
  if (metadata.files?.includes("SKILL.md")) score += 10;
  if (metadata.tags?.length >= 2) score += 10;
  if ((metadata.quality_score || 0) >= 80) score += 10;
  return score;
}

function scoreCommunityAdoption(metadata) {
  const popularity = metadata.popularity || {};
  const stars = Number(popularity.stars || metadata.stars || 0);
  const downloads = Number(popularity.downloads || metadata.downloads || 0);
  const dependents = Number(popularity.dependents || metadata.dependents || 0);
  let score = 20;
  if (stars > 0) score += Math.min(35, Math.log10(stars + 1) * 15);
  if (downloads > 0) score += Math.min(30, Math.log10(downloads + 1) * 10);
  if (dependents > 0) score += Math.min(15, dependents * 3);
  return score;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
