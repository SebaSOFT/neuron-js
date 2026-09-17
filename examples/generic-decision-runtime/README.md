# Generic decision runtime

This example demonstrates the opt-in decision runtime without using a vertical business problem, LLM, MCP server, workflow engine, UI, CLI, or external service.

The caller supplies:

- `definition.json` — a `DecisionDefinition` with context and outcome schemas, an approved component manifest, and a serializable script.
- `context.json` — the JSON context snapshot to evaluate.
- `expected-output.json` — the expected status, outcome, and receipt identity fields verified by the runner.

The local runner registers effect-free example components, evaluates the definition with `evaluateDecision`, and fails if the actual decision differs from the expected contract.

Run from the repository root:

```bash
yarn build
node examples/generic-decision-runtime/run.ts
```
