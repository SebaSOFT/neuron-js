import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const textFile = (path: string) => readFileSync(path, "utf8");
const jsonFile = <T>(path: string): T => JSON.parse(textFile(path)) as T;

const discoverySurfaces = [
  "README.md",
  "docs/concepts/decision-runtime.md",
  "docs/concepts/agentic-decision-architecture.md",
  "docs/use-cases/runnable-examples.md",
  "docs/ai-coding-assistants.md",
  "docs/public/llms.txt",
  "docs/public/llms-full.txt",
  "docs/public/skills/neuron-js/SKILL.md",
  "ai/skills/neuron-js/SKILL.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/neuron-js.mdc",
];

const decisionSchemaUrls = [
  "https://sebasoft.github.io/neuron-js/schemas/decision-definition.schema.json",
  "https://sebasoft.github.io/neuron-js/schemas/decision-evaluation.schema.json",
  "https://sebasoft.github.io/neuron-js/schemas/decision-receipt.schema.json",
  "https://sebasoft.github.io/neuron-js/schemas/decision-test-vector.schema.json",
];

const genericExampleFiles = [
  "examples/generic-decision-runtime/README.md",
  "examples/generic-decision-runtime/definition.json",
  "examples/generic-decision-runtime/context.json",
  "examples/generic-decision-runtime/expected-output.json",
  "examples/generic-decision-runtime/run.ts",
];

describe("decision-runtime documentation and release surfaces", () => {
  test("publishes a domain-neutral agentic decision architecture guide", () => {
    const guide = textFile("docs/concepts/agentic-decision-architecture.md");

    expect(guide).toContain("structured LLM extraction is advisory only");
    expect(guide).toContain("Host resolves canonical Decision Context");
    expect(guide).toContain("approved DecisionDefinition");
    expect(guide).toContain("receipt/replay evidence");
    expect(guide).toContain("host-only side-effect routing");
    expect(guide).toContain("Decision model vs LLM boundary");
    expect(guide).toContain("Tool/skill contract");
    expect(guide).toContain("Missing data");
    expect(guide).toContain("Invalid context");
    expect(guide).toContain("Out-of-policy request");
    expect(guide).toContain("```mermaid");
    expect(guide).not.toContain("mortgage");
    expect(guide).not.toContain("refund");
  });

  test("renders agentic guide Mermaid fences as diagrams in the built docs site", () => {
    const builtGuide = textFile(
      "docs/.vitepress/dist/concepts/agentic-decision-architecture.html",
    );
    const theme = textFile("docs/.vitepress/theme/index.ts");

    expect(builtGuide.match(/class=\"mermaid\"/g)).toHaveLength(3);
    expect(builtGuide).not.toContain("language-mermaid");
    expect(builtGuide).not.toContain("<code><span class=\"line\">");
    expect(theme).toContain("theme: isDarkMode() ? \"dark\" : \"default\"");
    expect(theme).toContain("onAfterRouteChanged");
    expect(theme).toContain("MutationObserver");
  });

  test("publishes the domain-neutral concept page with boundary and non-goals", () => {
    const page = textFile("docs/concepts/decision-runtime.md");

    expect(page).toContain("immutable context");
    expect(page).toContain("mutable workflow execution");
    expect(page).toContain("Explicit non-goals");
    expect(page).toContain("does not persist receipts");
    expect(page).toContain("does not fetch context");
    expect(page).toContain("does not add:");
    expect(page).toContain("LLM");
    expect(page).toContain("MCP");
    expect(page).toContain("CLI");
    expect(page).toContain("UI");
  });

  test("adds a runnable generic decision-runtime example to the examples command", () => {
    for (const file of genericExampleFiles) {
      expect(existsSync(file), file).toBe(true);
    }

    const packageJson = jsonFile<{ scripts: { examples: string }; files: string[] }>(
      "package.json",
    );
    expect(packageJson.scripts.examples).toContain(
      "node examples/generic-decision-runtime/run.ts",
    );
    expect(packageJson.files).toContain("examples");

    const definition = jsonFile<{ id: string; components: { actions: string[] } }>(
      "examples/generic-decision-runtime/definition.json",
    );
    expect(definition.id).toBe("generic-threshold-decision");
    expect(definition.components.actions).toEqual(["emit_generic_outcome"]);

    const runner = textFile("examples/generic-decision-runtime/run.ts");
    expect(runner).toContain("evaluateDecision");
    expect(runner).toContain("receiptIdentity");
    expect(runner).not.toContain("n8n");
    expect(runner).not.toContain("LangGraph");
    expect(runner).not.toContain("MCP");
  });

  test("updates every AI and discovery surface with the decision-runtime contract", () => {
    for (const file of discoverySurfaces) {
      const text = textFile(file);
      expect(text, file).toContain("decision");
      expect(text, file).toMatch(/evaluateDecision|Decision runtime|decision-runtime/i);
    }

    const vitepressConfig = textFile("docs/.vitepress/config.ts");
    expect(vitepressConfig).toContain("/concepts/decision-runtime");
    expect(vitepressConfig).toContain("/concepts/agentic-decision-architecture");
    expect(vitepressConfig).toContain("generic-decision-runtime");
  });

  test("links the agentic decision guide from example and AI-readable docs", () => {
    for (const surface of [
      "docs/use-cases/runnable-examples.md",
      "docs/ai-coding-assistants.md",
      "docs/public/llms.txt",
      "docs/public/llms-full.txt",
      "docs/public/skills/neuron-js/SKILL.md",
      "ai/skills/neuron-js/SKILL.md",
    ]) {
      const text = textFile(surface);
      expect(text, `${surface} missing architecture guide`).toContain(
        "agentic-decision-architecture",
      );
      expect(text, `${surface} missing host/LLM boundary`).toMatch(
        /LLM extraction|host.*canonical Decision Context|host-only side-effect/i,
      );
    }
  });

  test("publishes decision schemas from AI-readable documentation", () => {
    for (const surface of [
      "docs/ai-coding-assistants.md",
      "docs/public/llms.txt",
      "docs/public/llms-full.txt",
      "docs/public/skills/neuron-js/SKILL.md",
      "ai/skills/neuron-js/SKILL.md",
    ]) {
      const text = textFile(surface);
      for (const schemaUrl of decisionSchemaUrls) {
        expect(text, `${surface} missing ${schemaUrl}`).toContain(schemaUrl);
      }
    }
  });

  test("keeps public and package AI skills identical", () => {
    expect(textFile("docs/public/skills/neuron-js/SKILL.md")).toBe(
      textFile("ai/skills/neuron-js/SKILL.md"),
    );
  });
});
