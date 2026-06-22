# Benchmark visual asset manifest

Status: structure-only draft prompts. Final performance charts are blocked until measured benchmark output exists.

## Draft prompt assets

| Asset | Path | Claim status | Source dependency |
| --- | --- | --- | --- |
| Throughput chart prompt | `prompts/benchmark-chart-prompts.md#throughput-comparison-chart` | No numeric claim | actual benchmark output required |
| Cold-start chart prompt | `prompts/benchmark-chart-prompts.md#cold-start-comparison-chart` | No numeric claim | actual benchmark output required |
| Bundle-size chart prompt | `prompts/benchmark-chart-prompts.md#bundle-size-comparison-chart` | No numeric claim | actual benchmark output required |
| Validation-overhead chart prompt | `prompts/benchmark-chart-prompts.md#validation-overhead-chart` | No numeric claim | actual benchmark output required |
| Explanation-overhead chart prompt | `prompts/benchmark-chart-prompts.md#explanation-overhead-chart` | No numeric claim | actual benchmark output required |
| Methodology card prompt | `prompts/methodology-infographic.md` | Methodology only, no performance claim | `docs/benchmarks/methodology.md` |

## Intended generated output paths

- `generated/benchmark-chart-throughput.svg`
- `generated/benchmark-chart-cold-start.svg`
- `generated/benchmark-chart-bundle-size.svg`
- `generated/benchmark-chart-validation-overhead.svg`
- `generated/benchmark-chart-explanation-overhead.svg`
- `generated/methodology-card.svg`

## Publication blocker

Do not publish generated benchmark charts until the source file satisfies `result_kind: "actual_benchmark"`, `is_placeholder: false`, and `claims_allowed: true`.
