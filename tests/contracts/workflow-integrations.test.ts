import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  validateExecutionContext,
  validateScript,
} from "../../src/index.js";

const requiredFiles = [
  "docs/integrations/index.md",
  "docs/integrations/n8n.md",
  "docs/integrations/langgraph.md",
  "examples/n8n-code-node/README.md",
  "examples/n8n-code-node/rules.json",
  "examples/n8n-code-node/input.json",
  "examples/n8n-code-node/expected-output.json",
  "examples/n8n-code-node/run.ts",
  "examples/langgraph-decision-node/README.md",
  "examples/langgraph-decision-node/rules.json",
  "examples/langgraph-decision-node/input.json",
  "examples/langgraph-decision-node/expected-output.json",
  "examples/langgraph-decision-node/run.ts",
];

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("NJS-GROWTH-06 workflow automation recipes", () => {
  it.each(requiredFiles)("publishes %s", (filePath) => {
    expect(existsSync(filePath)).toBe(true);
  });

  it("validates recipe scripts and execution contexts before runtime", () => {
    for (const exampleDir of [
      "examples/n8n-code-node",
      "examples/langgraph-decision-node",
    ]) {
      expect(validateScript(readJson(`${exampleDir}/rules.json`)), exampleDir).toEqual({ ok: true, errors: [] });
      expect(validateExecutionContext(readJson(`${exampleDir}/input.json`)), exampleDir).toEqual({ ok: true, errors: [] });
    }
  });

  it("documents deterministic routing, LLM boundaries, validation, and explanations", () => {
    const n8n = readFileSync("docs/integrations/n8n.md", "utf8");
    const langgraph = readFileSync("docs/integrations/langgraph.md", "utf8");
    const combined = `${n8n}\n${langgraph}`;

    expect(combined).toContain("validateScript");
    expect(combined).toContain("validateExecutionContext");
    expect(combined).toContain("summarizeExecutionOutput");
    expect(combined).toContain("explainExecution");
    expect(n8n).toContain("deterministic workflow routing");
    expect(langgraph).toContain("LLM extraction");
    expect(langgraph).toContain("deterministic Neuron-JS decision");
  });

  it("links integration recipes from AI-readable surfaces", () => {
    const llms = readFileSync("docs/public/llms.txt", "utf8");
    const llmsFull = readFileSync("docs/public/llms-full.txt", "utf8");
    const skill = readFileSync("docs/public/skills/neuron-js/SKILL.md", "utf8");

    for (const content of [llms, llmsFull, skill]) {
      expect(content).toContain("n8n-code-node");
      expect(content).toContain("langgraph-decision-node");
    }
  });
});
