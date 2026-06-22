# Benchmarks and visual proof

NJS-GROWTH-07 defines the public proof system for Neuron-JS benchmarks, playground captures, explanation diagrams, README media, and social proof assets.

This section is a design and generation foundation. It does not publish benchmark claims. Benchmark numbers must come from measured harness output only.

## Files

- [Benchmark methodology and result contract](./methodology.md): competitor set, scenario matrix, input-size matrix, metric definitions, and placeholder-data policy.
- [Result JSON schema](./results.schema.json): machine-readable contract for benchmark output and downstream chart data.
- [Visual proof system](./visual-proof-system.md): palette, typography, composition, diagram style, chart rules, social-card constraints, and README proof strip guidance.
- [Visual proof prompt kit](./prompt-kit.md): reusable prompts for benchmark infographics, explainability trace diagrams, playground README GIF storyboards, AI-rule safety carousels, and README proof strips.
- [Asset folder recommendation](./assets/): recommended `docs/benchmarks/assets/` structure and data-integrity rules.

## Proof promise

Neuron-JS visual proof assets should make four claims visible:

1. Rules are serializable JSON data.
2. Schema validation happens before runtime.
3. Execution is deterministic through a developer-owned registry and Synapse.
4. Explanation traces show why a rule matched or failed.

## Data policy

Do not fabricate benchmark results. When data is unavailable, use non-numeric structure, empty states, or labels such as `pending measured data`.
