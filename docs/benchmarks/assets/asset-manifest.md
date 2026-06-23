# Benchmark visual asset manifest

Status: the five benchmark charts are generated from measured `actual_benchmark` output (`benchmarks/results/latest.actual.json`) by `benchmarks/charts/generate.ts`. See [benchmark results](../results.md). The prompts below remain as the design spec and regeneration reference.

## Draft prompt assets

| Asset | Path | Claim status | Source dependency |
| --- | --- | --- | --- |
| Throughput chart prompt | `prompts/benchmark-chart-prompts.md#throughput-comparison-chart` | No numeric claim | actual benchmark output required |
| Cold-start chart prompt | `prompts/benchmark-chart-prompts.md#cold-start-comparison-chart` | No numeric claim | actual benchmark output required |
| Bundle-size chart prompt | `prompts/benchmark-chart-prompts.md#bundle-size-comparison-chart` | No numeric claim | actual benchmark output required |
| Validation-overhead chart prompt | `prompts/benchmark-chart-prompts.md#validation-overhead-chart` | No numeric claim | actual benchmark output required |
| Explanation-overhead chart prompt | `prompts/benchmark-chart-prompts.md#explanation-overhead-chart` | No numeric claim | actual benchmark output required |
| Methodology card prompt | `prompts/methodology-infographic.md` | Methodology only, no performance claim | `docs/benchmarks/methodology.md` |

## Generated output paths

Charts generated from measured benchmark output:

- `generated/benchmark-chart-throughput.svg`
- `generated/benchmark-chart-cold-start.svg`
- `generated/benchmark-chart-bundle-size.svg`
- `generated/benchmark-chart-validation-overhead.svg`
- `generated/benchmark-chart-explanation-overhead.svg`

Methodology-only (no performance numbers):

- `generated/methodology-card.svg`

AI-rule-safety carousel (qualitative, no performance numbers):

- `generated/ai-rule-safety-carousel-1.svg` … `-5.svg`

## Publication blocker

Benchmark charts publish only from a source file that satisfies `result_kind: "actual_benchmark"`, `is_placeholder: false`, and `claims_allowed: true`. The committed charts were generated from such a file; regenerate with `yarn benchmark && yarn benchmark:charts` after any data change.
