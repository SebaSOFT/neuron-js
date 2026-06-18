# Eligibility Check Example

Run an eligibility decision from JSON. The rule checks whether an applicant score passes the required threshold, then writes the approved status into the execution context.

## Run

From the repository root:

```bash
yarn build
node examples/eligibility-check/run.ts
```

Expected summary:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "eligible": true,
  "decision": "approved",
  "messages": ["Eligibility decision: approved"]
}
```

## Files

- `rules.json` — the serializable Neuron-JS script.
- `input.json` — the execution context used by the script.
- `expected-output.json` — the checked output summary.
- `run.ts` — registers the example vocabulary, executes the script, and fails if output differs.
