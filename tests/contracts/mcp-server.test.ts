// NJS-SEO-5: contract test for the example MCP server.
//
// Spawns examples/mcp-server/run.ts as a real MCP stdio server, performs the
// initialize handshake, lists tools, and exercises the fail-closed path plus a
// successful execution and an explanation trace. Requires dist/esm to exist
// (yarn build) — same requirement as the other example-based contract tests.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const serverEntry = `${repoRoot}examples/mcp-server/run.ts`;

const validScript = {
  id: "mcp-contract",
  rules: [
    {
      id: "threshold-check",
      type: "simple_rule",
      options: {},
      conditions: [
        {
          id: "subtotal-check",
          type: "compare_two_numbers",
          options: {},
          params: [
            {
              id: "p1",
              name: "op1",
              type: "simple_number",
              value: "150",
              options: {},
            },
            {
              id: "p2",
              name: "comp",
              type: "comparator",
              value: ">=",
              options: {},
            },
            {
              id: "p3",
              name: "op2",
              type: "simple_number",
              value: "100",
              options: {},
            },
          ],
        },
      ],
      actions: [
        {
          id: "sum",
          type: "add_two_numbers",
          options: {},
          params: [
            {
              id: "a1",
              name: "op1",
              type: "simple_number",
              value: "10",
              options: {},
            },
            {
              id: "a2",
              name: "op2",
              type: "simple_number",
              value: "32",
              options: {},
            },
          ],
        },
      ],
    },
  ],
};

const executionContext = { state: {}, messages: [] };

describe("NJS-SEO-5 example MCP server", () => {
  let client: Client;

  beforeAll(async () => {
    const transport = new StdioClientTransport({
      command: "node",
      args: [serverEntry],
      cwd: repoRoot,
    });
    client = new Client({ name: "contract-test", version: "0.0.0" });
    await client.connect(transport);
  }, 30_000);

  afterAll(async () => {
    await client.close();
  });

  it("exposes exactly the three documented tools", async () => {
    const tools = await client.listTools();
    expect(tools.tools.map((t) => t.name).sort()).toEqual([
      "execute_decision",
      "explain_decision",
      "validate_script",
    ]);
  });

  it("rejects an invalid script without executing (fail-closed)", async () => {
    const result = await client.callTool({
      name: "validate_script",
      arguments: { script: { rules: "not-an-array" } },
    });
    const payload = JSON.parse(
      (result.content as Array<{ text: string }>)[0].text,
    );
    expect(payload.ok).toBe(false);
    expect(payload.errors.length).toBeGreaterThan(0);
  });

  it("accepts a valid script", async () => {
    const result = await client.callTool({
      name: "validate_script",
      arguments: { script: validScript },
    });
    expect(
      JSON.parse((result.content as Array<{ text: string }>)[0].text).ok,
    ).toBe(true);
  });

  it("executes a valid decision end to end", async () => {
    const result = await client.callTool({
      name: "execute_decision",
      arguments: { script: validScript, context: executionContext },
    });
    const summary = JSON.parse(
      (result.content as Array<{ text: string }>)[0].text,
    );
    expect(summary.ok).toBe(true);
    expect(summary.rulesExecuted).toBe(1);
  });

  it("explains a decision with a trace", async () => {
    const result = await client.callTool({
      name: "explain_decision",
      arguments: { script: validScript, context: executionContext },
    });
    const parsed = JSON.parse(
      (result.content as Array<{ text: string }>)[0].text,
    );
    expect(parsed.summary.ok).toBe(true);
    expect(parsed.explanation).toBeDefined();
  });

  it("keeps the server README honest about the tool set", () => {
    const readme = readFileSync(
      `${repoRoot}examples/mcp-server/README.md`,
      "utf8",
    );
    for (const tool of [
      "validate_script",
      "execute_decision",
      "explain_decision",
    ]) {
      expect(readme).toContain(tool);
    }
    expect(readme).toContain("fail-closed");
  });
});
