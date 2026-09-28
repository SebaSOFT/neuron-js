// NJS-SEO-6 follow-up: contract test for llms.txt v2 markdown mirrors and
// link relations (rel="alternate" type="text/markdown" + rel="describedby").
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

describe("llms.txt v2: markdown mirrors and link relations", () => {
  it("build pipeline copies markdown mirrors into dist", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts["docs:build"]).toContain("copy-md-mirrors.mjs");
  });

  it("transformHead injects per-page alternate and global describedby links", () => {
    const config = read("docs/.vitepress/config.ts");
    expect(config).toContain('rel: \'describedby\'');
    expect(config).toContain('rel: \'alternate\'');
    expect(config).toContain("type: 'text/markdown'");
    // mirror path derives from pageData.relativePath so each page points at its own .md twin
    expect(config).toContain("pageData.relativePath");
  });

  it("mirror script skips sitemap, vitepress internals and public assets", () => {
    const script = read("scripts/copy-md-mirrors.mjs");
    expect(script).toContain("SKIP_DIRS");
    for (const skipped of [".vitepress", "public", "node_modules", "dist"]) {
      expect(script).toContain(skipped);
    }
  });
});
