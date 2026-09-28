// NJS-SEO-5 follow-up: contract test for the WebMCP integration on the docs site.
//
// Verifies the integration surface end to end at the source level: the widget
// library is vendored, the registration script exists and registers the same
// three tools as the stdio server, the VitePress head loads both scripts on
// every page, the guide is linked from the sidebar and the integrations index,
// and the AI surfaces (llms.txt, llms-full.txt, SKILL.md) point to it.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("WebMCP documentation-site integration", () => {
  it("vendors the WebMCP widget library", () => {
    const lib = read("docs/public/webmcp/webmcp.js");
    expect(lib).toContain("class WebMCP");
  });

  it("registers the same three tools as the stdio MCP server", () => {
    const integration = read("docs/public/webmcp/neuron-webmcp.js");
    for (const tool of ["validate_script", "execute_decision", "explain_decision"]) {
      expect(integration).toContain(tool);
    }
    expect(integration).toContain("validateScript");
    expect(integration).toContain("validateExecutionContext");
    // fail-closed: validation happens before any execution
    const validateIdx = integration.indexOf("validateOrError");
    const executeIdx = integration.indexOf("new Synapse(");
    expect(validateIdx).toBeGreaterThan(-1);
    expect(executeIdx).toBeGreaterThan(validateIdx);
  });

  it("loads both scripts on every page via the VitePress head", () => {
    const config = read("docs/.vitepress/config.ts");
    expect(config).toContain("/neuron-js/webmcp/webmcp.js");
    expect(config).toContain("/neuron-js/webmcp/neuron-webmcp.js");
  });

  it("ships a guide linked from the sidebar and the integrations index", () => {
    const config = read("docs/.vitepress/config.ts");
    expect(config).toContain("link: '/integrations/webmcp'");
    const index = read("docs/integrations/index.md");
    expect(index).toContain("./webmcp.md");
    expect(read("docs/integrations/webmcp.md")).toContain("validate_script");
  });

  it("surfaces WebMCP on all AI-readable assets", () => {
    expect(read("docs/public/llms.txt")).toContain("integrations/webmcp.html");
    expect(read("docs/public/llms-full.txt")).toContain("integrations/webmcp.html");
    const skill = read("docs/public/skills/neuron-js/SKILL.md");
    expect(skill).toContain("WebMCP recipe");
    // the packaged mirror stays byte-identical
    expect(read("ai/skills/neuron-js/SKILL.md")).toBe(skill);
  });
});
