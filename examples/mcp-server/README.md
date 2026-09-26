# neuron-js MCP server

A minimal [Model Context Protocol](https://modelcontextprotocol.io) server that lets AI agents
(Claude Desktop, Cursor, and any MCP client) validate, execute, and explain neuron-js rule
scripts directly — without writing integration code.

## Tools

| Tool | What it does |
| --- | --- |
| `validate_script` | Validates an `ExecutionScript` JSON against the neuron-js schema without executing it. |
| `execute_decision` | Validates and executes an `ExecutionScript` against an `ExecutionContext`, returns the summarized output. |
| `explain_decision` | Same as `execute_decision` plus the explanation trace (which rules matched and why). |

The server is read-only and deterministic: it performs no side effects beyond returning JSON.
Every call validates the script and the context first (fail-closed); invalid inputs return
`invalid_script` / `invalid_context` with the exact validation errors instead of executing.

## Run it

```bash
# from the repository root (requires Node >= 24 and a build: yarn build)
node examples/mcp-server/run.ts
```

The server speaks MCP over stdio. It imports neuron-js from `dist/esm`, the same build the npm
package ships.

## Register in Claude Desktop

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "neuron-js": {
      "command": "node",
      "args": ["/absolute/path/to/neuron-js/examples/mcp-server/run.ts"],
      "env": {}
    }
  }
}
```

## Register in Cursor

`.cursor/mcp.json`:

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

## Tool input example

`execute_decision` with a minimal script (full field reference: the
[script schema](https://sebasoft.github.io/neuron-js/api/) and the
[examples](https://github.com/SebaSOFT/neuron-js/tree/main/examples)):

```json
{
  "script": {
    "id": "demo",
    "rules": [
      {
        "id": "flag",
        "type": "simple_rule",
        "options": {},
        "conditions": [
          {
            "id": "check",
            "type": "compare_two_numbers",
            "options": {},
            "params": [
              { "id": "p1", "name": "op1", "type": "simple_number", "value": "5", "options": {} },
              { "id": "p2", "name": "comp", "type": "comparator", "value": ">", "options": {} },
              { "id": "p3", "name": "op2", "type": "simple_number", "value": "3", "options": {} }
            ]
          }
        ],
        "actions": []
      }
    ]
  },
  "context": { "state": {}, "messages": [] }
}
```

The `params` array uses named parameter slots (`op1`, `comp`, `op2` for the comparison
condition) — see the built-in plugins in the docs for the exact slot names of each
condition/action type.

## Scope

Intentionally minimal: three tools, stdio only, no resources, no prompts. The registry is the
built-in one (`new Neuron()`); custom registered actions/conditions of the host application
are out of scope for this example server.
