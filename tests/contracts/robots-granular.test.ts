// NJS-SEO-6 follow-up: contract test for the granular robots.txt agentic
// access policy. Pins the SebaSOFT decision (2026-09): training crawlers
// are ALLOWED on the neuron-js documentation site.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const robots = readFileSync("docs/public/robots.txt", "utf8");

describe("granular robots.txt agentic policy", () => {
  it("explicitly allows citation-eligible AI bots", () => {
    for (const bot of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"]) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });

  it("explicitly allows user-triggered fetchers", () => {
    for (const bot of ["ChatGPT-User", "Perplexity-User", "Claude-User"]) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });

  it("pins the training-crawler decision: ALLOWED", () => {
    for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended"]) {
      expect(robots).toContain(`User-agent: ${bot}`);
      // every explicit rule in this file is an Allow — fail if someone flips policy
      const section = robots.split(`User-agent: ${bot}`)[1]?.split("User-agent:")[0] ?? "";
      expect(section).toContain("Allow: /");
      expect(section).not.toContain("Disallow");
    }
    expect(robots).toContain("training crawlers are ALLOWED");
  });

  it("keeps the wildcard open and the sitemap for all agents", () => {
    expect(robots).toContain("User-agent: *");
    expect(robots).not.toContain("Disallow");
    expect(robots).toContain(
      "Sitemap: https://sebasoft.github.io/neuron-js/sitemap.xml",
    );
  });
});
