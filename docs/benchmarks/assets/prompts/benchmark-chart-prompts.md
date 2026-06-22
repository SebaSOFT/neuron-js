# Benchmark chart prompts

Use these prompts only with real measured benchmark output. If real output is missing, render a non-numeric empty state labeled `pending measured data` and do not show values from `benchmarks/sample-results.placeholder.json`.

Required source gates for every metric chart:

- `result_kind: "actual_benchmark"`
- `is_placeholder: false`
- `claims_allowed: true`
- exact source path included in the asset metadata
- Node version, package versions, commit SHA, benchmark date, warmup iterations, and measured iterations included in the chart or adjacent metadata

Shared visual rules:

- Use dark background `#020617`, raised panels `#0f172a`, and faint grid `#1e293b`.
- Use Neuron-JS cyan `#22d3ee`, json-rules-engine violet `#a78bfa`, JsonLogic amber `#fbbf24`, hand-coded TypeScript emerald `#34d399`, and rule-engine-js slate `#94a3b8`.
- Keep Neuron-JS identifiable but not visually oversized.
- Do not use 3D charts, cropped axes, trophy icons, rank badges, `fastest` language, or decorative data marks.
- Every visible number must exist in the source benchmark artifact.

## Throughput comparison chart

Metric: `throughput_decisions_per_second`

Unit: decisions per second

Interpretation note: Higher throughput may be better only within the named scenario and input size.

Final path: `docs/benchmarks/assets/generated/benchmark-chart-throughput.svg`

```text
Create a dark technical benchmark chart for @sebasoft/neuron-js.

Title: "Throughput comparison"
Metric: throughput_decisions_per_second
Unit: decisions per second

Compare @sebasoft/neuron-js, json-rules-engine, json-logic-js, hand-coded-typescript, and rule-engine-js from the supplied benchmark source file only. Show scenario and input size in the subtitle. Include source path, Node version, package versions, commit SHA, benchmark date, warmup iterations, and measured iterations.

If the source artifact fails the required source gates, render no bars and show: "Pending measured data — structure only."
```

## Cold-start comparison chart

Metric: `cold_start_ms`

Unit: milliseconds

Interpretation note: Lower cold start may be better only for the named runtime setup.

Final path: `docs/benchmarks/assets/generated/benchmark-chart-cold-start.svg`

```text
Create a dark technical benchmark chart for @sebasoft/neuron-js.

Title: "Cold-start comparison"
Metric: cold_start_ms
Unit: milliseconds

Compare the same engine set from the supplied benchmark source file only. Keep axis labels explicit that the metric is measured in milliseconds. Include methodology metadata and source path. Do not imply browser, serverless, or runtime conclusions beyond the source artifact.

If the source artifact fails the required source gates, render no bars and show: "Pending measured data — structure only."
```

## Bundle-size comparison chart

Metric: `bundle_size_minified_bytes`

Unit: minified bytes

Interpretation note: Lower bundle size may help browser/playground use, but does not measure runtime behavior.

Final path: `docs/benchmarks/assets/generated/benchmark-chart-bundle-size.svg`

```text
Create a dark technical bundle-size chart for @sebasoft/neuron-js.

Title: "Bundle-size comparison"
Metric: bundle_size_minified_bytes
Unit: minified bytes

Compare the same engine set from the supplied benchmark source file only. Label the bundler/minification context if the source artifact provides it. Do not convert units unless the chart also preserves the exact source value in metadata.

If the source artifact fails the required source gates, render no bars and show: "Pending measured data — structure only."
```

## Validation-overhead chart

Metric: `validation_overhead_ms`

Unit: milliseconds

Interpretation note: Shows the cost of schema validation as a delta against equivalent non-validation execution.

Final path: `docs/benchmarks/assets/generated/benchmark-chart-validation-overhead.svg`

```text
Create a dark technical validation-overhead chart for @sebasoft/neuron-js.

Title: "Validation overhead"
Metric: validation_overhead_ms
Unit: milliseconds

Compare the same engine set from the supplied benchmark source file only. Make the subtitle clear that this is overhead, not total runtime. Include scenario, input size, source path, and methodology metadata.

If the source artifact fails the required source gates, render no bars and show: "Pending measured data — structure only."
```

## Explanation-overhead chart

Metric: `explanation_overhead_ms`

Unit: milliseconds

Interpretation note: Shows the cost of trace/explanation collection as a delta against trace-disabled execution.

Final path: `docs/benchmarks/assets/generated/benchmark-chart-explanation-overhead.svg`

```text
Create a dark technical explanation-overhead chart for @sebasoft/neuron-js.

Title: "Explanation overhead"
Metric: explanation_overhead_ms
Unit: milliseconds

Compare the same engine set from the supplied benchmark source file only. Make the subtitle clear that this is trace/explanation overhead, not total runtime. Include scenario, input size, source path, and methodology metadata.

If the source artifact fails the required source gates, render no bars and show: "Pending measured data — structure only."
```

## Verification checklist

- Every visible number appears in the source benchmark artifact.
- Axis labels match the metric and unit.
- Chart metadata includes source path, scenario, input size, Node version, package versions, commit SHA, benchmark date, warmup iterations, and measured iterations.
- Alt text names the metric, scenario, input size, and no-fabrication policy.
- Any conclusion is limited to the named scenario and input size.
