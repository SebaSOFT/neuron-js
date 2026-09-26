# MCP server

Expose neuron-js to AI agents as [Model Context Protocol](https://modelcontextprotocol.io) tools.
The bundled example server (`examples/mcp-server`) lets Claude Desktop, Cursor, or any MCP
client validate, execute, and explain rule scripts without writing integration code.

## Tools

| Tool | What it does |
| --- | --- |
| `validate_script` | Validates an `ExecutionScript` against the neuron-js schema without executing it. |
| `execute_decision` | Validates and executes an `ExecutionScript` against an `ExecutionContext`; returns the summarized output. |
| `explain_decision` | Same as `execute_decision` plus the explanation trace. |

## Guarantees

- **Fail-closed**: every call validates script and context first. Invalid input returns
  `invalid_script` / `invalid_context` with exact validation errors instead of executing.
- **Deterministic**: the server runs the same `Synapse` engine as the library; no
  probabilistic branching.
- **No side effects**: tools return JSON only. Side effects belong to the host application.

## Run and register

```bash
node examples/mcp-server/run.ts   # from the repo root; requires yarn build
```

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "neuron-js": {
      "command": "node",
      "args": ["/absolute/path/to/neuron-js/examples/mcp-server/run.ts"]
    }
  }
}
```

Cursor (`.cursor/mcp.json`) uses the same shape. See the example's
[README](https://github.com/SebaSOFT/neuron-js/tree/main/examples/mcp-server) for details and a
complete tool-input example.

## Scope

Intentionally minimal: three tools, stdio transport, built-in registry only. The example
demonstrates the pattern; host applications can embed the same `McpServer` registration with
their custom registered conditions and actions.
