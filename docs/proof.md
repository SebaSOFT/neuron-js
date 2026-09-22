# Neuron-JS proof and milestones

This page concentrates publicly inspectable project evidence. It does not claim customer adoption, market share, user counts, reviews, or outcomes that cannot be checked from the linked source.

No adoption totals, customer counts, testimonials, or review scores are asserted here.

## Package and project metadata

- Package: [`@sebasoft/neuron-js`](https://www.npmjs.com/package/@sebasoft/neuron-js)
- Source manifest: [`package.json`](../package.json) — version `0.7.0`, MIT license, Node.js `>=24`, and canonical `llms` / `llmsFull` URLs.
- Repository: [SebaSOFT/neuron-js](https://github.com/SebaSOFT/neuron-js)
- License text: [MIT](../LICENSE)
- CI definition: [GitHub Actions CI workflow](https://github.com/SebaSOFT/neuron-js/actions/workflows/ci.yml) runs linting, tests, and a package build on pushes and pull requests to `main`.

The CI workflow source describes configured checks; it is not a claim that any future commit has passed them. Inspect the [public Actions history](https://github.com/SebaSOFT/neuron-js/actions) for a particular run.

## Documentation and runnable examples

- Documentation site: [sebasoft.github.io/neuron-js](https://sebasoft.github.io/neuron-js/)
- [Runnable examples](./use-cases/runnable-examples.md): pricing, eligibility, workflow routing, a generic decision runtime, n8n, and LangGraph.
- [Core concepts](./overview.md) and [decision runtime](./concepts/decision-runtime.md)
- [n8n and LangGraph integration recipes](./integrations/index.md)

The examples are executable repository artifacts. Run `yarn examples` from a checkout to build the package and compare each example's actual output with its expected contract.

## Schemas, validation, and explainability

- [Schemas, validation, and explainability](./schemas-validation-explainability.md)
- [Script JSON Schema](../schemas/script.schema.json)
- [Execution-context JSON Schema](../schemas/execution-context.schema.json)
- [Decision-definition JSON Schema](../schemas/decision-definition.schema.json)
- [Decision receipt JSON Schema](../schemas/decision-receipt.schema.json)

The documented validation helpers (`validateScript`, `validateExecutionContext`, and the decision-runtime validators) validate structural contracts before execution. They do not prove that a rule expresses the intended business policy; policy still needs examples, tests, and accountable review.

## AI-readable assets

- [AI coding-assistant guide](./ai-coding-assistants.md)
- [Compact `llms.txt`](https://sebasoft.github.io/neuron-js/llms.txt)
- [Full `llms-full.txt`](https://sebasoft.github.io/neuron-js/llms-full.txt)
- [Official Neuron-JS AI skill](https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md)

These assets point agents to package-root imports, schemas, executable examples, validation-before-execution, and explainability guidance. They are documentation interfaces, not a claim that generated rules are automatically safe.

## Comparisons and benchmarks

- [Comparison and migration guide](./comparisons/index.md), including json-rules-engine, JsonLogic, node-rules, and if/else boundaries.
- [Benchmark results](./benchmarks/results.md)
- [Benchmark methodology](./benchmarks/methodology.md)
- [Raw measured benchmark output](../benchmarks/results/latest.actual.json)
- [Benchmark result schema](https://sebasoft.github.io/neuron-js/benchmarks/results.schema.json)

Benchmark claims are limited to the recorded `actual_benchmark` data and its stated methodology, scenarios, runtime, and commit provenance. Reproduce the harness with `yarn benchmark`, then regenerate charts with `yarn benchmark:charts`.

## Verified release history

Verification snapshot: **2026-09-22**.

- Source package metadata: [`package.json`](../package.json) records version `0.7.0`.
- Source release notes: [`CHANGELOG.md`](../CHANGELOG.md) records `0.7.0` as a minor release with the opt-in deterministic decision runtime, validated decision definitions, immutable context evaluation, receipts and replay, portable test vectors, and runnable documentation.
- Git tag and release: [GitHub Release `v0.7.0`](https://github.com/SebaSOFT/neuron-js/releases/tag/v0.7.0), published 2026-09-17.
- npm registry: [`@sebasoft/neuron-js@0.7.0`](https://www.npmjs.com/package/@sebasoft/neuron-js/v/0.7.0) was the `latest` dist-tag at verification.
- Earlier public releases: [v0.6.1](https://github.com/SebaSOFT/neuron-js/releases/tag/v0.6.1), [v0.6.0](https://github.com/SebaSOFT/neuron-js/releases/tag/v0.6.0), and [v0.5.2](https://github.com/SebaSOFT/neuron-js/releases/tag/v0.5.2).

Release status is reported from the repository manifest, changelog, GitHub Release, and npm registry as separate sources. Re-check the registry and release page before restating this snapshot after a new publish or tag.
