import { existsSync, readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

const textFile = (path: string) => readFileSync(path, "utf8");

const requiredProofLinks = [
  "https://www.npmjs.com/package/@sebasoft/neuron-js",
  "https://github.com/SebaSOFT/neuron-js",
  "../LICENSE",
  "https://github.com/SebaSOFT/neuron-js/actions/workflows/ci.yml",
  "./use-cases/runnable-examples.md",
  "./schemas-validation-explainability.md",
  "https://sebasoft.github.io/neuron-js/llms.txt",
  "https://sebasoft.github.io/neuron-js/llms-full.txt",
  "https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md",
  "https://sebasoft.github.io/neuron-js/benchmarks/results.schema.json",
  "./comparisons/index.md",
  "./benchmarks/results.md",
  "./benchmarks/methodology.md",
  "https://github.com/SebaSOFT/neuron-js/releases/tag/v0.7.0",
];

describe("proof and milestones documentation", () => {
  test("publishes source-linked package, repository, CI, docs, contract, comparison, and benchmark evidence", () => {
    expect(existsSync("docs/proof.md")).toBe(true);

    const proof = textFile("docs/proof.md");
    for (const link of requiredProofLinks) {
      expect(proof).toContain(link);
    }

    expect(proof).toContain("No adoption totals, customer counts, testimonials, or review scores are asserted here.");
    expect(proof).not.toContain("./public/");
  });

  test("records the verified v0.7.0 package, release, and registry status with an auditable date", () => {
    const proof = textFile("docs/proof.md");

    expect(proof).toContain("## Verified release history");
    expect(proof).toContain("2026-09-22");
    expect(proof).toContain("`0.7.0`");
    expect(proof).toContain("npm registry");
    expect(proof).toContain("GitHub Release");
  });

  test("makes proof discoverable from VitePress and AI-readable routing documents", () => {
    const config = textFile("docs/.vitepress/config.ts");
    const llms = textFile("docs/public/llms.txt");
    const llmsFull = textFile("docs/public/llms-full.txt");

    expect(config).toContain("{ text: 'Proof', link: '/proof' }");
    expect(config).toContain("{ text: 'Proof & Milestones', link: '/proof' }");
    expect(llms).toContain("https://sebasoft.github.io/neuron-js/proof.html");
    expect(llmsFull).toContain("https://sebasoft.github.io/neuron-js/proof.html");
  });
});
