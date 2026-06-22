# Neuron-JS benchmark methodology and result contract

Source of record: `chaos-vault/50-research/neuron-js-growth-plan.md` lines 294-318, supported by `neuron-js-marketing-assets-benchmark.md` lines 87-100 and `neuron-js-social-demand-gap.md` lines 160-169. Hindsight recall was queried for this task and returned no relevant stored memories; the vault notes above are the governing source.

This page defines the NJS-GROWTH-07 benchmark harness contract. It is intentionally conservative: no benchmark claim is valid until the executable harness emits `result_kind: "actual_benchmark"` with `is_placeholder: false` and `claims_allowed: true`.

## Competitor set

The harness/result contract covers exactly these engines for the first public proof bundle:

| Engine | Adapter key | Role |
| --- | --- | --- |
| Neuron-JS | `@sebasoft/neuron-js` | First-party rules engine under test. |
| json-rules-engine | `json-rules-engine` | Closest default Node.js JSON rules-engine competitor. |
| JsonLogic | `json-logic-js` | Portable JSON predicate format competitor. |
| Hand-coded TypeScript | `hand-coded-typescript` | Baseline for direct conditional logic without engine overhead. |
| rule-engine-js | `rule-engine-js` | Smaller modern competitor selected because it installs/builds in this repository. |

`rulepilot` remains an alternate candidate only if `rule-engine-js` becomes infeasible later. Do not mix both in the same first chart set without updating `docs/benchmarks/results.schema.json`.

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

Every result row must contain these fields. Units and source definitions are duplicated in `docs/benchmarks/results.schema.json` for machine consumers.

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

## Initial harness contract

A future executable harness should:

1. Build adapters for `@sebasoft/neuron-js`, `json-rules-engine`, `json-logic-js`, `hand-coded-typescript`, and `rule-engine-js`.
2. Run each adapter against `pricing-discount`, `eligibility-approval`, and `workflow-routing` fixtures.
3. Execute `smoke`, `small`, and `medium` profiles by default; gate `large` behind an explicit flag.
4. Measure cold start separately from warm throughput.
5. Measure validation and explanation overhead as delta timings against the same scenario/input profile.
6. Emit JSON matching `docs/benchmarks/results.schema.json`.
7. Set `result_kind: "actual_benchmark"`, `is_placeholder: false`, and `claims_allowed: true` only for real measured output.

## Visual asset consumers

The first visual asset bundle can safely bind to these paths:

- Schema: `docs/benchmarks/results.schema.json`
- Placeholder sample: `benchmarks/sample-results.placeholder.json`
- Methodology: `docs/benchmarks/methodology.md`

Use the placeholder file for layout only. Replace it with real harness output before making any chart label, README proof strip, or social asset that implies measured performance.
