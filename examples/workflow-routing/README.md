# Workflow Routing Example

Run a deterministic workflow-routing decision from JSON. The rule checks ticket priority from `input.json` and routes high-priority work to the escalation lane.

## Run

From the repository root:

```bash
yarn build
node examples/workflow-routing/run.ts
```

Expected summary:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "route": "escalation",
  "slaHours": 4,
  "messages": ["Workflow route: escalation within 4h"]
}
```

## Files

- `rules.json` — the serializable Neuron-JS script.
- `input.json` — the execution context used by the script.
- `expected-output.json` — the checked output summary.
- `run.ts` — registers the example vocabulary, executes the script, and fails if output differs.
