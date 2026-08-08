import { normalizeList } from "./utils.js";

export function parseSimpleYaml(text) {
  const result = {};
  let currentKey = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = [];
      result[currentKey].push(unquote(listMatch[1].trim()));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();
      result[currentKey] = value ? parseValue(value) : "";
    }
  }

  return result;
}

export function stringifySimpleYaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  const lines = [];

  for (const [key, entry] of Object.entries(value)) {
    if (Array.isArray(entry)) {
      lines.push(`${pad}${key}:`);
      for (const item of entry) lines.push(`${pad}  - ${escapeScalar(item)}`);
    } else if (entry && typeof entry === "object") {
      lines.push(`${pad}${key}:`);
      lines.push(stringifySimpleYaml(entry, indent + 2));
    } else {
      lines.push(`${pad}${key}: ${escapeScalar(entry)}`);
    }
  }

  return lines.join("\n");
}

function parseValue(value) {
  if (value.startsWith("[") && value.endsWith("]")) return normalizeList(value.slice(1, -1));
  if (/^\d+(\.\d+)?$/.test(value)) return Number(value);
  return unquote(value);
}

function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

function escapeScalar(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!text || /[:#\n\r]|^\s|\s$/.test(text)) return JSON.stringify(text);
  return text;
}
