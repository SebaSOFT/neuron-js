# Neuron-JS benchmark methodology and result contract

Source of record: internal Neuron-JS growth, marketing/benchmark, and social-demand research for NJS-GROWTH-07.

This page defines the NJS-GROWTH-07 benchmark harness contract. It is intentionally conservative: no benchmark claim is valid until the executable harness emits `result_kind: "actual_benchmark"` with `is_placeholder: false` and `claims_allowed: true`. That harness now exists (`benchmarks/run.ts`, run with `yarn benchmark`); the published numbers are on the [benchmark results](./results.md) page.

## Competitor set

The harness/result contract covers exactly these engines for the first public proof bundle:

| Engine | Adapter key | Role |
| --- | --- | --- |
| Neuron-JS | `@sebasoft/neuron-js` | First-party rules engine under test. |
| json-rules-engine | `json-rules-engine` | Closest default Node.js JSON rules-engine competitor. |
| JsonLogic | `json-logic-js` | Portable JSON predicate format competitor. |
| Hand-coded TypeScript | `hand-coded-typescript` | Baseline for direct conditional logic without engine overhead. |
| rule-engine-js | `rule-engine-js` | Smaller modern competitor selected because it installs/builds in this repository. |

`rulepilot` remains an alternate candidate only if `rule-engine-js` becomes infeasible later. Do not mix both in the same first chart set without updating `docs/public/benchmarks/results.schema.json`.

## Scenario matrix

| Scenario | Inputs represented | Why it exists |
| --- | --- | --- |
| `pricing-discount` | tier, region, coupon, cart total, account age | Shows business-rule pricing decisions and validation/explanation overhead. |
| `eligibility-approval` | age, country, verification status, risk score, account flags | Shows policy/approval style decisions with clear pass/fail outcomes. |
| `workflow-routing` | channel, urgency, customer segment, confidence score, escalation flags | Shows deterministic workflow routing and trace usefulness. |

## Input-size matrix

| Profile | Decisions | Usage |
| --- | ---: | --- |
| `smoke` | 100 | Correctness and trace sanity. |
| `small` | 1,000 | Local development feedback. |
| `medium` | 10,000 | Chartable throughput. |
| `large` | 100,000 | Optional; run only if runtime remains practical in CI/local machines. |

## Stable result fields

Every result row must contain these fields. Units and source definitions are duplicated in `docs/public/benchmarks/results.schema.json` for machine consumers.

| Field | Unit | Source |
| --- | --- | --- |
| `engine` | identifier | Harness adapter name for the implementation under test; fixed enum for cross-run joins. |
| `scenario` | identifier | Scenario slug produced by the benchmark scenario matrix. |
| `input_size` | profile | Named workload profile, not raw row count, so visual assets can group runs consistently. |
| `warmup_iterations` | decisions | Number of unmeasured warmup decisions completed before timing. |
| `measured_iterations` | decisions | Number of measured decisions included in timing statistics. |
| `throughput_decisions_per_second` | decisions/second | Measured decisions divided by elapsed measured wall-clock seconds. |
| `p50_ms` | milliseconds | Median per-decision latency from measured iterations. |
| `p95_ms` | milliseconds | 95th percentile per-decision latency from measured iterations. |
| `cold_start_ms` | milliseconds | Wall-clock time to load/import the engine adapter and execute the first decision in a fresh process or isolated worker. |
| `bundle_size_minified_bytes` | bytes | Minified adapter+engine bundle byte count from the configured bundler output. |
| `validation_overhead_ms` | milliseconds | Additional median latency for validation-enabled execution versus validation-disabled execution on the same scenario/input profile. |
| `explanation_overhead_ms` | milliseconds | Additional median latency for trace/explanation-enabled execution versus trace-disabled execution on the same scenario/input profile. |
| `node_version` | semver/runtime | Node.js version reported by `process.version` for the benchmark run. |
| `package_version` | semver or source | Package version or source label for the engine adapter under test. |
| `commit_sha` | git sha | Repository commit SHA for the Neuron-JS benchmark harness and local implementation. |

## Placeholder data policy

`benchmarks/sample-results.placeholder.json` is synthetic wiring data only. It exists so chart, carousel, README-strip, and playground work can consume stable fields before real measurements exist.

Visual/publication agents must reject files where any of these are true:

- `result_kind` is `placeholder_sample`.
- `is_placeholder` is `true`.
- `claims_allowed` is `false`.
- row `notes` contains `synthetic placeholder`.

Synthetic sample values must never be used in README copy, social posts, npm copy, or public performance claims.

## Harness contract

The executable harness (`benchmarks/run.ts`):

1. Builds adapters for `@sebasoft/neuron-js`, `json-rules-engine`, `json-logic-js`, `hand-coded-typescript`, and `rule-engine-js`.
2. Runs each adapter against `pricing-discount`, `eligibility-approval`, and `workflow-routing` fixtures (reused from `examples/`).
3. Executes `smoke`, `small`, and `medium` profiles by default; `large` is reserved for explicit runs.
4. Measures cold start separately from warm throughput.
5. Measures validation and explanation overhead as delta timings against the same scenario/input profile.
6. Emits JSON matching `docs/public/benchmarks/results.schema.json`.
7. Sets `result_kind: "actual_benchmark"`, `is_placeholder: false`, and `claims_allowed: true` only for real measured output.

## How each metric is measured

- **Fairness gate.** Before timing, every engine must reproduce the scenario's canonical decision (e.g. pricing `finalTotal: 105`, `discountAmount: 20`); the run aborts on any mismatch, so all engines are timed doing equivalent work.
- **Throughput / p50 / p95.** Warmup iterations run untimed, then measured iterations run in batches; per-decision latency is averaged per batch (so per-call timer overhead does not dominate sub-microsecond engines). Throughput is total measured decisions over total measured seconds.
- **Cold start.** Median wall-clock across several fresh Node processes to import the engine adapter and execute the first decision; the child starts its timer before importing the engine, so Node's own startup is excluded.
- **Bundle size.** `esbuild` bundles and minifies the engine's public surface (`export * from "<engine>"`, ESM, node platform); the output byte length is recorded. The hand-coded baseline has no library dependency (`0`).
- **Validation / explanation overhead.** Neuron-JS only: the per-decision latency delta of running `validateScript` (resp. `explainExecution`) around an otherwise identical execution. Competitors provide no equivalent step, so their measured delta is `0`.

## Visual asset consumers

The first visual asset bundle can safely bind to these paths:

- Schema: `docs/public/benchmarks/results.schema.json`
- Placeholder sample: `benchmarks/sample-results.placeholder.json`
- Methodology: `docs/benchmarks/methodology.md`

Use the placeholder file for layout only. Replace it with real harness output before making any chart label, README proof strip, or social asset that implies measured performance.
