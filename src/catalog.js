import fs from "node:fs";
import path from "node:path";
import { stripBom } from "./utils.js";

export function loadCatalog(catalogPath = "skills/catalog.json") {
  const absolutePath = path.resolve(catalogPath);
  if (!fs.existsSync(absolutePath)) return { packs: [] };
  return JSON.parse(stripBom(fs.readFileSync(absolutePath, "utf8")));
}
