// Copies VitePress markdown sources into dist as .md mirrors, so every page
// has a clean Markdown twin served at the same URL path (llms.txt v2 pattern).
// Mirrors are excluded from sitemap.xml by construction: the sitemap is
// generated during `vitepress build`, which runs before this script.
//
// Excluded from mirroring: .vitepress config, public/ assets (already copied
// verbatim by VitePress itself), node_modules.
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const DOCS_DIR = new URL("../docs", import.meta.url).pathname;
const DIST_DIR = join(DOCS_DIR, ".vitepress", "dist");
const SKIP_DIRS = new Set([".vitepress", "public", "node_modules", "dist"]);

const walk = (dir, base = "") => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      out.push(...walk(full, rel));
    } else if (entry.endsWith(".md")) {
      out.push(rel);
    }
  }
  return out;
};

const mirrors = walk(DOCS_DIR);
for (const rel of mirrors) {
  const target = join(DIST_DIR, rel);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(DOCS_DIR, rel), target);
}
console.log(`md mirrors: copied ${mirrors.length} pages into dist`);
