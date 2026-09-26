// NJS-SEO-5: minimal MCP server exposing neuron-js as tools for AI agents.
//
// Three tools over stdio:
//   - validate_script:    validate an ExecutionScript JSON without executing it
//   - execute_decision:   validate + execute an ExecutionScript against a context
//   - explain_decision:   validate + execute + explanation trace
//
// Run: node examples/mcp-server/run.ts  (Node >= 24 native TypeScript)
// The server speaks MCP over stdio; register it in Claude Desktop/Cursor with
// a command like: node /path/to/neuron-js/examples/mcp-server/run.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
  type ScriptInterface,
} from "../../dist/esm/index.js";

/** Parse tool input that may arrive as JSON text or as a parsed object. */
function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // fall through to the error below
    }
    throw new Error(
      "input must be a JSON object or a JSON string encoding an object",
    );
  }
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  throw new Error(
    "input must be a JSON object or a JSON string encoding an object",
  );
}

const scriptSchema = z
  .object({})
  .passthrough()
  .describe(
    "The ExecutionScript JSON: { rules: [{ type: 'simple_rule', conditions: [...], actions: [...] }] }",
  );
const contextSchema = z
  .object({})
  .passthrough()
  .describe("The ExecutionContext JSON, e.g. { state: { ... }, messages: [] }");

const server = new McpServer(
  { name: "neuron-js", version: "0.7.5" },
  {
    instructions:
      "Deterministic JSON rules engine. Tools validate and execute serializable rule scripts (ExecutionScript) against a JSON context. validate_script checks a script without running it; execute_decision runs it; explain_decision runs it and returns an explanation trace.",
  },
);

function validateOrError(
  scriptValue: Record<string, unknown>,
  contextValue?: Record<string, unknown>,
): { error?: { error: string; validation_errors: unknown[] } } {
  const scriptValidation = validateScript(scriptValue);
  if (!scriptValidation.ok) {
    return {
      error: {
        error: "invalid_script",
        validation_errors: scriptValidation.errors,
      },
    };
  }
  if (contextValue !== undefined) {
    const contextValidation = validateExecutionContext(contextValue);
    if (!contextValidation.ok) {
      return {
        error: {
          error: "invalid_context",
          validation_errors: contextValidation.errors,
        },
      };
    }
  }
  return {};
}

server.registerTool(
  "validate_script",
  {
    title: "Validate an ExecutionScript",
    description:
      "Validate a neuron-js ExecutionScript (pure JSON rules) without executing it. Returns ok plus validation errors.",
    inputSchema: { script: scriptSchema },
  },
  async ({ script }) => {
    const result = validateScript(asRecord(script));
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  },
);

server.registerTool(
  "execute_decision",
  {
    title: "Execute a decision",
    description:
      "Validate and execute an ExecutionScript against an ExecutionContext (JSON objects). Returns the summarized execution output: success, rule results, messages and final context state.",
    inputSchema: { script: scriptSchema, context: contextSchema },
  },
  async ({ script, context }) => {
    const scriptValue = asRecord(script);
    const contextValue = asRecord(context);
    const failure = validateOrError(scriptValue, contextValue);
    if (failure.error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(failure.error, null, 2),
          },
        ],
        isError: true,
      };
    }

    const neuron = new Neuron();
    const synapse = new Synapse(neuron);
    const result = synapse.execute(
      scriptValue as unknown as ScriptInterface,
      contextValue as unknown as import("../../dist/esm/index.js").ExecutionContext,
    );
    const summary = summarizeExecutionOutput(result);

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(summary, null, 2) },
      ],
    };
  },
);

server.registerTool(
  "explain_decision",
  {
    title: "Explain a decision",
    description:
      "Validate, execute, and explain an ExecutionScript against an ExecutionContext. Returns the summarized output plus the explanation trace (which rules matched and why).",
    inputSchema: { script: scriptSchema, context: contextSchema },
  },
  async ({ script, context }) => {
    const scriptValue = asRecord(script);
    const contextValue = asRecord(context);
    const failure = validateOrError(scriptValue, contextValue);
    if (failure.error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(failure.error, null, 2),
          },
        ],
        isError: true,
      };
    }

    const neuron = new Neuron();
    const synapse = new Synapse(neuron);
    const result = synapse.execute(
      scriptValue as unknown as ScriptInterface,
      contextValue as unknown as import("../../dist/esm/index.js").ExecutionContext,
    );
    const summary = summarizeExecutionOutput(result);
    const explanation = explainExecution({
      script: scriptValue as unknown as ScriptInterface,
      result,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ summary, explanation }, null, 2),
        },
      ],
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

void main();
