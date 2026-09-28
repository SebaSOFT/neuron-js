# WebMCP

The documentation site itself is a **WebMCP-enabled page**: it runs an MCP server in your
browser, so any MCP client (Claude Desktop, Cursor, Cline, Windsurf) can connect directly and
call neuron-js tools **in your browser** — no backend, no API keys, no installation.

## How to connect

1. Configure your MCP client once:

```json
{ "mcpServers": { "webmcp": { "command": "npx", "args": ["-y", "@jason.today/webmcp@latest", "--mcp"] } } }
```

2. Ask your client to generate a WebMCP token (`npx -y @jason.today/webmcp --new` also works).
3. Click the widget in the bottom-right corner of any page of this site and paste the token.
4. The tools appear in your client (restart the client if you do not see them).

## Tools exposed by this site

| Tool | What it does |
| --- | --- |
| `validate_script` | Validates an `ExecutionScript` against the neuron-js schema without executing it. |
| `execute_decision` | Validates and executes an `ExecutionScript` against an `ExecutionContext`; returns the summarized output. |
| `explain_decision` | Same as `execute_decision` plus the explanation trace. |

These are the **same three tools** exposed by the [stdio MCP server](./mcp-server.md) shipped in
`examples/mcp-server` — same contracts, same fail-closed validation. The difference: the runtime
here is the real `@sebasoft/neuron-js` loaded from the npm registry and executed in your browser.
The library is browser-safe (zero `node:` imports), so the exact engine that runs on a server
also runs in the page.

Two resources are also exposed: the compact `llms.txt` index and the official `SKILL.md` AI
skill, both served by this site.

## Guarantees

- **Fail-closed**: every call validates script and context first; invalid input returns the
  exact validation errors and never executes.
- **No side effects**: tools return JSON only; nothing on the page is mutated.
- **Your model, your keys**: the site never touches an LLM; your MCP client does the inference.
  The site is only the tool surface.

## Provenance and status

The widget uses the open-source
[`@jason.today/webmcp`](https://github.com/jasonjmcghee/WebMCP) library — the original WebMCP
proposal that demonstrated this pattern. It is **not** the W3C WebMCP specification draft
(`navigator.modelContext`, [webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp));
the spec is still a Community Group draft with no stable browser support. When browsers ship
the native API, this page will prefer it; until then, the library works today.

## Scope

Read-only documentation surface. The tools execute example-scale scripts; they are not a hosted
execution service. For production use, run neuron-js in your own runtime, or embed the
[stdio MCP server](./mcp-server.md).
