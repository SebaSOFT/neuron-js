# Benchmarks and visual proof

NJS-GROWTH-07 defines the public proof system for Neuron-JS benchmarks, playground captures, explanation diagrams, README media, and social proof assets.

This section is a design and generation foundation. It does not publish benchmark claims. Benchmark numbers must come from measured harness output only.

## Files

- [Benchmark methodology and result contract](./methodology.md): competitor set, scenario matrix, input-size matrix, metric definitions, and placeholder-data policy.
- [Result JSON schema](/benchmarks/results.schema.json): machine-readable contract for benchmark output and downstream chart data.
- [Visual proof system](./visual-proof-system.md): palette, typography, composition, diagram style, chart rules, social-card constraints, and README proof strip guidance.
- [Benchmark visual pack plan](./benchmark-visual-pack.md): chart asset matrix, aspect ratios, channel guardrails, draft prompt paths, and publication blocker.
- [Explainability trace diagram metadata](./assets/generated/explainability-trace-diagram.md): source grounding, caption, alt text, integrity notes, and README-safe SVG path.
- [Visual proof prompt kit](./prompt-kit.md): reusable prompts for benchmark infographics, explainability trace diagrams, playground README GIF storyboards, AI-rule safety carousels, and README proof strips.
- [Playground README demo capture specification](../playground/readme-demo-capture.md): route, selectors, storyboard, future capture command, and fixture-backed result contract.
- [Asset folder recommendation](./assets/): recommended `docs/benchmarks/assets/` structure and data-integrity rules.

## Proof promise

Neuron-JS visual proof assets should make four claims visible:

1. Rules are serializable JSON data.
2. Schema validation happens before runtime.
3. Execution is deterministic through a developer-owned registry and Synapse.
4. Explanation traces show why a rule matched or failed.

## README-safe proof visual

The current README uses the explainability trace diagram because it is inspectable, asset-backed, and contains no benchmark numbers or superiority claims.

![Neuron-JS diagram showing rule JSON and business input flowing through schema validation, developer registry, deterministic Synapse evaluation, result output, explanation trace, and audit-ready decision.](./assets/generated/explainability-trace-diagram.svg)

Supporting files:

- SVG asset: [`assets/generated/explainability-trace-diagram.svg`](./assets/generated/explainability-trace-diagram.svg)
- Metadata, caption, and integrity notes: [`assets/generated/explainability-trace-diagram.md`](./assets/generated/explainability-trace-diagram.md)
- HTML preview wrapper: [`assets/generated/explainability-trace-diagram.html`](./assets/generated/explainability-trace-diagram.html)

## Data policy

Do not fabricate benchmark results. When data is unavailable, use non-numeric structure, empty states, or labels such as `pending measured data`.
