# NJS-GROWTH-07 benchmark visual pack plan

Status: draft asset pack and prompt set. Final benchmark charts are blocked until measured benchmark output exists.

Source of record:

- `chaos-vault/50-research/neuron-js-growth-plan.md`, `NJS-GROWTH-07` lines 294-318: proof assets must cover benchmarks, playground, and visual explanation.
- `chaos-vault/50-research/neuron-js-marketing-assets-benchmark.md`, lines 87-100 and 160-174: publish honest benchmarks, compare the required competitor set, expose methodology, support playground proof, trace panel, and README GIF.
- `chaos-vault/50-research/neuron-js-social-demand-gap.md`, lines 160-169 and 184-210: clean charts, visual proof, and the TypeScript-first explainability/validation wedge are the strongest trust signals.

Hindsight recall was queried for this task and returned no relevant stored memories. The vault files above are the governing source.

## Current data status

No publishable benchmark data exists yet.

The only available benchmark fixture is `benchmarks/sample-results.placeholder.json`. It is explicitly marked:

- `result_kind: "placeholder_sample"`
- `is_placeholder: true`
- `claims_allowed: false`

Therefore this pack contains non-numeric chart prompts and draft asset paths only. They must not be used as performance claims, README proof, social claims, npm copy, or comparison claims until replaced with measured harness output matching `docs/benchmarks/results.schema.json`.

## Source data contract for final charts

Final assets must use a benchmark artifact that satisfies all of these gates:

- `result_kind` is `actual_benchmark`.
- `is_placeholder` is `false`.
- `claims_allowed` is `true`.
- Every visible number exists in the source artifact.
- The asset metadata includes source path, scenario, input size, Node version, package versions, commit SHA, benchmark date, warmup iterations, and measured iterations.
- Axis labels use the same metric meaning documented in `docs/benchmarks/methodology.md` and `docs/benchmarks/results.schema.json`.

If any gate fails, render empty states or labels such as `pending measured data`; do not render numeric claims.

## Competitor and scenario scope

Competitor set:

1. `@sebasoft/neuron-js`
2. `json-rules-engine`
3. `json-logic-js` / JsonLogic
4. `hand-coded-typescript`
5. `rule-engine-js`

`rulepilot` remains an alternate only if `rule-engine-js` becomes infeasible and the benchmark contract is updated.

Scenario set:

- `pricing-discount`
- `eligibility-approval`
- `workflow-routing`

Input-size set:

- `smoke`
- `small`
- `medium`
- `large` only when runtime remains practical and the benchmark run explicitly includes it.

## Asset set

| Asset | Draft prompt path | Final generated asset path | Final source requirement | Primary surfaces |
| --- | --- | --- | --- | --- |
| Throughput comparison chart | `docs/benchmarks/assets/prompts/benchmark-chart-prompts.md#throughput-comparison-chart` | `docs/benchmarks/assets/generated/benchmark-chart-throughput.svg` | `throughput_decisions_per_second` from actual benchmark output | docs, README support, X/LinkedIn |
| Cold-start comparison chart | `docs/benchmarks/assets/prompts/benchmark-chart-prompts.md#cold-start-comparison-chart` | `docs/benchmarks/assets/generated/benchmark-chart-cold-start.svg` | `cold_start_ms` from actual benchmark output | docs, blog, social |
| Bundle-size comparison chart | `docs/benchmarks/assets/prompts/benchmark-chart-prompts.md#bundle-size-comparison-chart` | `docs/benchmarks/assets/generated/benchmark-chart-bundle-size.svg` | `bundle_size_minified_bytes` from actual benchmark output | docs, README support |
| Validation-overhead chart | `docs/benchmarks/assets/prompts/benchmark-chart-prompts.md#validation-overhead-chart` | `docs/benchmarks/assets/generated/benchmark-chart-validation-overhead.svg` | `validation_overhead_ms` from actual benchmark output | docs, social proof |
| Explanation-overhead chart | `docs/benchmarks/assets/prompts/benchmark-chart-prompts.md#explanation-overhead-chart` | `docs/benchmarks/assets/generated/benchmark-chart-explanation-overhead.svg` | `explanation_overhead_ms` from actual benchmark output | docs, social proof |
| Honest methodology infographic/card | `docs/benchmarks/assets/prompts/methodology-infographic.md` | `docs/benchmarks/assets/generated/methodology-card.svg` | No performance numbers; must cite methodology and no-fabrication policy | docs, social, PR review |

## Aspect ratio and export matrix

| Surface | Ratio | Recommended dimensions | Notes |
| --- | --- | --- | --- |
| README proof strip | `5:1` or `4:1` | `1600x320` or `1600x400` | Wide proof strip; use non-numeric placeholders until measured data exists. |
| Docs benchmark hero | `16:9` | `1600x900` | Best for methodology and chart overview. |
| Docs inline chart | `16:9` or `4:3` | `1200x675` or `1200x900` | Keep labels readable at docs column width. |
| X / LinkedIn link card | `16:9` | `1200x675` | Maximum headline eight words. Include methodology footnote when numbers appear. |
| LinkedIn / Instagram feed | `1:1` | `1200x1200` | Use one metric per card. |
| LinkedIn carousel | `4:5` | `1080x1350` | One claim per slide; source footnote on each measured slide. |
| Blog hero | `16:9` | `1600x900` | Prefer methodology-first framing over winner framing. |

## Channel copy guardrails

Use this claim structure only after measured data exists:

- Method first: `Measured on <node_version> at <commit_sha>; see methodology.`
- Metric second: name the exact metric and unit.
- Interpretation third: explain what the metric does and does not prove.

Do not use:

- `fastest`, `best`, `beats`, `dominates`, or winner language unless the source data proves it for the named scenario and input size.
- Synthetic placeholder values in copy, alt text, chart labels, posts, README, or npm copy.
- Cropped axes, trophy icons, rank badges, or chart decorations that imply unsupported superiority.

## Final production workflow

1. Receive actual benchmark artifact matching `docs/benchmarks/results.schema.json`.
2. Validate the data gates in this plan.
3. Generate five metric charts from the artifact, one metric per chart.
4. Attach methodology metadata to each SVG or adjacent `.md` metadata file.
5. Produce social exports using the aspect ratio matrix.
6. Run visual QA: axis labels, units, source path, contrast, legibility, alt text, and no unsupported claims.
7. Only then consider README or social publication.

## Publication blocker

Final publication is blocked until real measured benchmark output exists. The draft prompts and paths in this pack are structure-only assets for review, layout alignment, and downstream generation.
