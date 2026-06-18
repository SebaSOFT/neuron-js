# Runnable examples

`neuron-js` includes first-party examples that can be executed from a clean checkout. Each example keeps the rule definition, input context, expected output, and runner separate so developers and coding agents can inspect the full contract before changing code.

## Run all examples

From the repository root:

```bash
yarn examples
```

The command builds the package, then runs:

- `examples/pricing-rules/run.ts`
- `examples/eligibility-check/run.ts`
- `examples/workflow-routing/run.ts`

Each runner exits with a non-zero status if the actual output differs from `expected-output.json`.

## Example catalog

### Pricing rules

Path: [`examples/pricing-rules/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/pricing-rules)

Demonstrates a cart-pricing decision stored as JSON. The script checks a cart subtotal and applies a VIP discount through a registered action.

Files:

- `rules.json` — serializable script.
- `input.json` — execution context.
- `expected-output.json` — verified output summary.
- `run.ts` — executable TypeScript runner.

### Eligibility check

Path: [`examples/eligibility-check/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/eligibility-check)

Demonstrates an approval decision. The script checks an applicant score and writes an approved eligibility decision into context.

Files:

- `rules.json` — serializable script.
- `input.json` — execution context.
- `expected-output.json` — verified output summary.
- `run.ts` — executable TypeScript runner.

### Workflow routing

Path: [`examples/workflow-routing/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/workflow-routing)

Demonstrates deterministic routing for automation workflows. The script checks ticket priority and assigns an escalation route with an SLA.

Files:

- `rules.json` — serializable script.
- `input.json` — execution context.
- `expected-output.json` — verified output summary.
- `run.ts` — executable TypeScript runner.

## Why this structure

The examples are intentionally data-first:

- JSON rule files can be stored, versioned, reviewed, or generated.
- Input files make scenario testing repeatable.
- Expected outputs define a clear contract for humans and AI coding agents.
- TypeScript runners show the minimal registry setup required by each scenario.
