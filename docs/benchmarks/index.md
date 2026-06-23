# Benchmarks & proof

Honest, reproducible evidence that Neuron-JS is fast enough, small enough, and — above
all — inspectable. Every number on these pages comes from a real benchmark run you can
reproduce with `yarn benchmark`; nothing is hand-entered.

## What's here

- **[Benchmark results](./results.md)** — measured throughput, cold-start, bundle-size,
  validation, and explanation-overhead, compared against `json-rules-engine`,
  `json-logic-js`, a hand-coded TypeScript baseline, and `rule-engine-js`.
- **[Methodology](./methodology.md)** — what we compare, how each metric is measured, and
  our no-fabricated-numbers policy.
- **[AI-rule safety](./ai-rule-safety.md)** — why AI-drafted JSON rules still need schema
  validation, a developer-owned registry, and explanation traces before production.

## How a rule becomes an explainable decision

Neuron-JS turns serializable JSON rules into deterministic, auditable decisions: input and
rule JSON are schema-validated, executed through a developer-owned registry and Synapse, and
returned with an explanation trace showing why a rule matched or failed.

![Neuron-JS diagram showing rule JSON and business input flowing through schema validation, developer registry, deterministic Synapse evaluation, result output, explanation trace, and audit-ready decision.](./assets/generated/explainability-trace-diagram.svg)

This makes four things visible:

1. Rules are serializable JSON data.
2. Schema validation happens before runtime.
3. Execution is deterministic through a developer-owned registry and Synapse.
4. Explanation traces show why a rule matched or failed.
