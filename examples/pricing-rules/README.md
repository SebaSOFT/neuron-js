# Pricing Rules Example

Run a pricing decision from serializable JSON. The rule checks the cart subtotal from `input.json`, applies a VIP discount from `rules.json`, and verifies the final context against `expected-output.json`.

## Run

From the repository root:

```bash
yarn build
node examples/pricing-rules/run.ts
```

Expected summary:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "finalTotal": 105,
  "discountAmount": 20,
  "messages": ["Applied 16% discount: -20"]
}
```

## Files

- `rules.json` — the serializable Neuron-JS script.
- `input.json` — the execution context used by the script.
- `expected-output.json` — the checked output summary.
- `run.ts` — registers the example vocabulary, executes the script, and fails if output differs.
