// NJS-SEO-6 follow-up: contract test for the Google "Add to preferred sources"
// footer button on the documentation site.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("Google preferred-source footer button", () => {
  it("loads the official publisher.js in the VitePress head", () => {
    expect(read("docs/.vitepress/config.ts")).toContain(
      "https://news.google.com/swg/js/v1/publisher.js",
    );
  });

  it("renders the standard button container in the layout-bottom footer", () => {
    const component = read("docs/.vitepress/theme/PreferredSourceFooter.vue");
    expect(component).toContain("google-add-preferred-source-btn");
    expect(component).toContain("preferred-source-footer");
    // theme aware: light/dark follows the site theme
    expect(component).toContain("isDark");
  });

  it("mounts the footer via the layout-bottom slot", () => {
    const theme = read("docs/.vitepress/theme/index.ts");
    expect(theme).toContain("PreferredSourceFooter");
    expect(theme).toContain("layout-bottom");
  });

  it("states the eligible source honestly (domain, not subdirectory)", () => {
    const component = read("docs/.vitepress/theme/PreferredSourceFooter.vue");
    expect(component).toContain("sebasoft.github.io");
  });
});
