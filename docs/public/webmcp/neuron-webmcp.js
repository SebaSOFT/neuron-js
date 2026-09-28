// Neuron-JS documentation site — WebMCP integration.
//
// Serves the site as an MCP server in the visitor's browser: any MCP client
// (Claude Desktop, Cursor, ...) can connect through the WebMCP widget and call
// the same three tools exposed by the stdio server in examples/mcp-server.
//
// The runtime is the REAL @sebasoft/neuron-js from the npm registry — the
// library is browser-safe (zero node: imports) and executes visitor-supplied
// rule scripts in-page. Fail-closed: every call validates the script and the
// execution context first; invalid input returns the exact validation errors
// and never executes.

/* eslint-disable */
// @ts-nocheck

const NEURON_VERSION = "0.7.5";
const NEURON_ESM_URL = `https://unpkg.com/@sebasoft/neuron-js@${NEURON_VERSION}/dist/esm/index.js`;

const scriptSchema = {
  type: "object",
  properties: {
    script: {
      type: "object",
      description:
        "ExecutionScript JSON: { id, rules: [{ id, type: 'simple_rule', options, conditions: [...], actions: [...] }] }",
    },
  },
  required: ["script"],
};

const scriptContextSchema = {
  type: "object",
  properties: {
    script: scriptSchema.properties.script,
    context: {
      type: "object",
      description: "ExecutionContext JSON, e.g. { state: {}, messages: [] }",
    },
  },
  required: ["script", "context"],
};

const asRecord = (value) => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      /* fall through */
    }
    throw new Error("input must be a JSON object or a JSON string encoding an object");
  }
  if (value && typeof value === "object") return value;
  throw new Error("input must be a JSON object or a JSON string encoding an object");
};

const text = (obj) => ({
  content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
});

let lib = null;
const loadNeuron = async () => {
  if (lib) return lib;
  lib = await import(NEURON_ESM_URL);
  return lib;
};

const validateOrError = async (scriptValue, contextValue) => {
  const { validateScript, validateExecutionContext } = await loadNeuron();
  const scriptValidation = validateScript(scriptValue);
  if (!scriptValidation.ok) {
    return { error: { error: "invalid_script", validation_errors: scriptValidation.errors } };
  }
  const contextValidation = validateExecutionContext(contextValue);
  if (!contextValidation.ok) {
    return { error: { error: "invalid_context", validation_errors: contextValidation.errors } };
  }
  return {};
};

const registerNeuronTools = (mcp) => {
  mcp.registerTool(
    "validate_script",
    "Validate a neuron-js ExecutionScript (pure JSON rules) without executing it. Returns ok plus validation errors.",
    scriptSchema,
    async (args) => {
      const { validateScript } = await loadNeuron();
      return text(validateScript(asRecord(args.script)));
    },
  );

  mcp.registerTool(
    "execute_decision",
    "Validate and execute an ExecutionScript against an ExecutionContext. Returns the summarized output.",
    scriptContextSchema,
    async (args) => {
      const scriptValue = asRecord(args.script);
      const contextValue = asRecord(args.context);
      const failure = await validateOrError(scriptValue, contextValue);
      if (failure.error) return text(failure.error);

      const { Neuron, Synapse, summarizeExecutionOutput } = await loadNeuron();
      const result = new Synapse(new Neuron()).execute(scriptValue, contextValue);
      return text(summarizeExecutionOutput(result));
    },
  );

  mcp.registerTool(
    "explain_decision",
    "Validate, execute, and explain an ExecutionScript. Returns the summarized output plus the explanation trace.",
    scriptContextSchema,
    async (args) => {
      const scriptValue = asRecord(args.script);
      const contextValue = asRecord(args.context);
      const failure = await validateOrError(scriptValue, contextValue);
      if (failure.error) return text(failure.error);

      const { Neuron, Synapse, summarizeExecutionOutput, explainExecution } = await loadNeuron();
      const result = new Synapse(new Neuron()).execute(scriptValue, contextValue);
      return text({
        summary: summarizeExecutionOutput(result),
        explanation: explainExecution({ script: scriptValue, result }),
      });
    },
  );

  mcp.registerPrompt(
    "pricing-rules-example",
    "Show the runnable pricing-rules example: a complete ExecutionScript JSON ready for validate_script or execute_decision.",
    [],
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Load the pricing-rules example script and run validate_script on it.",
          },
        },
      ],
    }),
  );

  mcp.registerResource(
    "llms-txt",
    "The compact AI-readable index of the neuron-js documentation.",
    { uri: "https://sebasoft.github.io/neuron-js/llms.txt", mimeType: "text/plain" },
    async (uri) => {
      const response = await fetch(uri);
      return { contents: [{ uri, mimeType: "text/plain", text: await response.text() }] };
    },
  );

  mcp.registerResource(
    "skill-md",
    "The official neuron-js AI skill (SKILL.md) served by this documentation site.",
    { uri: "https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md", mimeType: "text/markdown" },
    async (uri) => {
      const response = await fetch(uri);
      return { contents: [{ uri, mimeType: "text/markdown", text: await response.text() }] };
    },
  );
};

const initWebMcp = () => {
  if (typeof WebMCP === "undefined") {
    console.warn("[neuron-js webmcp] WebMCP global not found; widget disabled");
    return;
  }

  const mcp = new WebMCP({
    color: "#7c3aed",
    position: "bottom-right",
    size: "36px",
    padding: "20px",
  });

  registerNeuronTools(mcp);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWebMcp);
} else {
  initWebMcp();
}
