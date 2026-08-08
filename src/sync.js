import { exportSkillPackage, exportTargets } from "./exporter.js";
import { listInstalled } from "./installer.js";

export function syncAgents(options = {}) {
  const workspace = options.workspace || ".";
  const agents = options.agent && options.agent !== "all" ? [options.agent] : Object.keys(exportTargets);
  const installed = listInstalled(workspace);
  const exports = [];
  for (const skill of installed) {
    for (const agent of agents) exports.push({ agent, ...exportSkillPackage(agent, skill.path, { out: workspace }) });
  }
  return { workspace, agents, synced: exports.length, exports };
}
