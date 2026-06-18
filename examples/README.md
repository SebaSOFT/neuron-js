# Runnable Examples

These examples are copy-paste friendly Neuron-JS scenarios. Each folder contains a serializable `rules.json`, an `input.json` execution context, an `expected-output.json` contract, and a `run.ts` file that executes and verifies the scenario.

## Available examples

- [Pricing rules](pricing-rules/) — apply a VIP discount when a cart meets a subtotal threshold.
- [Eligibility check](eligibility-check/) — approve an applicant when a score crosses a threshold.
- [Workflow routing](workflow-routing/) — route a high-priority support ticket to an escalation lane.

## Run all examples

From the repository root:

```bash
yarn examples
```

Or run one example directly after building:

```bash
yarn build
node examples/pricing-rules/run.ts
```
