# NJS-GROWTH-07 visual proof prompt kit

This prompt kit is reusable input for downstream visual agents. It is intentionally data-safe: every benchmark prompt requires real measured data from a benchmark source file and forbids imagined values.

Use alongside:

- `docs/benchmarks/visual-proof-system.md`
- `docs/benchmarks/assets/README.md`

Global source position:

- Product wedge: TypeScript-first, explainable, schema-validatable JSON business rules for AI-assisted software and workflow automation.
- Proof objective: make Neuron-JS credible, inspectable, and useful beyond README claims.
- Data integrity rule: inject real benchmark measurements only. If measurements are missing, render schemas, empty states, or placeholder labels with no numeric claims.

## Global prompt variables

Fill these before generation:

```yaml
project_name: "@sebasoft/neuron-js"
positioning: "AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions"
scenario: "pricing-discount | eligibility-approval | workflow-routing"
input_size: "smoke | small | medium | large"
benchmark_source_path: "path/to/results.json-or.csv"
node_version: "actual Node.js version"
commit_sha: "actual benchmark commit SHA"
benchmark_date: "YYYY-MM-DD"
engines:
  - "@sebasoft/neuron-js"
  - "json-rules-engine"
  - "json-logic-js / JsonLogic"
  - "hand-coded TypeScript conditions"
  - "rule-engine-js or rulepilot"
metrics:
  - "throughput_decisions_per_second"
  - "p50_ms"
  - "p95_ms"
  - "cold_start_ms"
  - "bundle_size_minified_bytes"
  - "validation_overhead_ms"
  - "explanation_overhead_ms"
```

If any required variable is unknown, the generator must stop and request the missing source, or render a non-numeric placeholder clearly marked `sample structure only`.

## 1. Benchmark infographic pack

### Objective

Create a benchmark infographic pack that compares Neuron-JS to `json-rules-engine`, JsonLogic, hand-coded TypeScript conditions, and one smaller modern competitor using honest measured data.

The asset should make methodology visible before claims.

### Prompt

```text
Create a dark technical benchmark infographic pack for @sebasoft/neuron-js.

Objective:
Show credible, inspectable benchmark evidence for a TypeScript-first, explainable, schema-validatable JSON business rules engine. Compare @sebasoft/neuron-js against json-rules-engine, json-logic-js / JsonLogic, hand-coded TypeScript conditions, and [rule-engine-js or rulepilot]. Do not imply a winner unless the provided benchmark data proves it.

Data source:
Use only benchmark data from: [benchmark_source_path].
Required fields: engine, scenario, input_size, warmup_iterations, measured_iterations, throughput_decisions_per_second, p50_ms, p95_ms, cold_start_ms, bundle_size_minified_bytes, validation_overhead_ms, explanation_overhead_ms, node_version, package_version, commit_sha.
If any numeric value is missing, render an empty state or label it as "pending measured data". Never invent or approximate numbers.

Layout:
Dashboard + comparison matrix.
Canvas: 16:9 for docs hero, plus export-safe variants at 1:1 and 4:5.
Top band: title, scenario, input size, benchmark date, Node version, commit SHA.
Main grid:
1. Throughput chart: decisions per second by engine.
2. Latency chart: p50_ms and p95_ms by engine.
3. Cold start chart: cold_start_ms by engine.
4. Bundle size chart: minified bytes by engine.
5. Validation overhead chart: validation_overhead_ms by engine.
6. Explanation overhead chart: explanation_overhead_ms by engine.
Bottom band: methodology strip with warmup iterations, measured iterations, package versions, and "measured data only" note.

Text labels:
- Main title: "Measured proof for JSON business rules"
- Subtitle: "Validate -> Execute -> Explain -> Compare"
- Method label: "No synthetic benchmark values. Source: [benchmark_source_path]"
- Engine labels exactly as provided in the data source.
- Metric labels exactly matching the schema field names or their readable equivalents.

Visual hierarchy:
Use @sebasoft/neuron-js cyan as the identity color but keep equal chart scale and honest comparison. Use dark panels, faint grid, monospace metric labels, and small methodology footnotes. Make the data source and commit SHA visible, not hidden.

Style:
Dark technical schematic, crisp dashboard, no 3D charts, no mascot, no generic SaaS gradients. Use semantic colors: cyan for Neuron-JS/inspectability, emerald for validation/pass, violet for explainability, amber for method/caution, rose for errors or warnings, slate for neutral competitors.

Negative constraints:
Do not fabricate benchmark results. Do not use fake numbers, lorem ipsum, unlabeled axes, cropped axes, trophy icons, "fastest" claims, or decorative data marks. Do not show Neuron-JS as winning unless real source data establishes that outcome. Do not include generic AI robot imagery.

Reproducibility notes:
Output should include alt text, exact data source path, Node version, package versions, commit SHA, benchmark date, and export dimensions. Keep generated source editable as SVG/HTML or layered design file where possible.
```

### Verification checklist

- Every visible number exists in the benchmark source file.
- Axis labels and metric names are correct.
- Methodology strip includes Node version, commit SHA, warmup iterations, and measured iterations.
- Alt text names the scenario, metric group, and no-fabrication policy.

## 2. Explainability trace diagram

### Objective

Create a diagram that explains how JSON rules move through validation, developer registry constraints, deterministic execution, result output, and explanation trace.

### Prompt

```text
Create a dark SVG-style explainability trace diagram for @sebasoft/neuron-js.

Objective:
Make Neuron-JS inspectability visible. Show how serializable JSON business rules become deterministic decisions with schema validation and an audit-friendly explanation trace.

Layout:
Linear progression / structural breakdown, 16:9.
Flow left to right:
1. Rule JSON
2. Schema validation
3. Developer-owned registry
4. Synapse deterministic execution
5. Result object
6. Explanation trace
7. Audit / review
Add a secondary error branch from Schema validation to Validation errors -> Repair loop. Add a secondary safety note from Developer-owned registry to "Only approved actions, conditions, parameters, and rules can execute."

Text labels:
- Title: "From JSON rule to explainable decision"
- Rule JSON panel: "Serializable script"
- Validation panel: "Schema-first validation"
- Registry panel: "Developer-approved vocabulary"
- Execution panel: "Synapse runs deterministically"
- Result panel: "Decision result"
- Trace panel: "Why it matched or failed"
- Error branch: "Validation errors show exact repair paths"

Visual hierarchy:
Main path uses cyan active arrows. Validation pass uses emerald check markers. Explainability trace uses violet audit-chain accents. Error/repair branch uses rose dashed lines. Keep all boxes aligned to a faint grid with adequate spacing.

Style:
Dark technical architecture diagram, rounded rectangles, 1.5px strokes, JetBrains Mono labels, subtle grid background, no JavaScript animation required. Use concise JSON snippets inside the Rule JSON and Trace panels, but keep them readable.

Negative constraints:
Do not show arbitrary code execution. Do not show business users directly running unsafe generated rules. Do not use magic wand, robot, black-box AI, or vague cloud icons. Do not include benchmark numbers.

Reproducibility notes:
Deliver as standalone SVG or self-contained HTML with inline SVG. Include alt text and a source note referencing docs/schemas-validation-explainability.md. Verify it renders in a browser.
```

### Verification checklist

- The error branch teaches repair, not failure panic.
- The registry is visible as the control boundary.
- Diagram fits README/docs width without tiny labels.

## 3. Playground README GIF storyboard

### Objective

Storyboard a short GIF that proves the playground is useful: edit rule JSON and input JSON, validate, run, inspect result, inspect trace, and share state.

### Prompt

```text
Create a storyboard for a short README GIF demonstrating the Neuron-JS playground.

Objective:
Show public proof that Neuron-JS is inspectable and useful beyond README claims. The GIF should demonstrate a deterministic pricing or eligibility decision using rule JSON, input JSON, validation, result output, trace inspection, validation errors, and shareable state.

Layout:
Storyboard with 6 frames, 16:9.
Frame 1: Playground opens with scenario selector set to [pricing-discount or eligibility-approval].
Frame 2: Rule JSON and input JSON panels are visible side-by-side.
Frame 3: User clicks Validate; schema pass state appears with emerald check.
Frame 4: User clicks Run; result panel shows deterministic decision output.
Frame 5: User opens Trace; trace rows explain why a rule matched or failed.
Frame 6: User changes one invalid field; validation error highlights JSON path, then Share URL state appears.

Text labels:
- Frame 1: "Choose a business decision"
- Frame 2: "Inspect rule JSON + input JSON"
- Frame 3: "Validate before runtime"
- Frame 4: "Run deterministic decision"
- Frame 5: "Explain why it matched"
- Frame 6: "Repair errors and share state"

Visual hierarchy:
The active interaction should be highlighted with a cyan focus ring. Validation success uses emerald. Validation errors use rose with exact path labels. Trace panel uses violet. Keep UI controls large enough for README viewing.

Style:
Crisp product UI mock, dark technical theme, accessible contrast, minimal motion. Use realistic UI structure: tabs, split panes, JSON editor, result card, trace list, validation error list, share button. Motion should be a calm cursor/click sequence, not flashy animation.

Negative constraints:
Do not include fake benchmark numbers. Do not show arbitrary code execution. Do not imply business users can safely publish generated rules without validation, tests, and approval. Avoid generic dashboard art or decorative robot imagery.

Reproducibility notes:
When the real playground exists, capture from the actual UI and keep the storyboard labels as title overlays only if needed. Export target: GIF under 5 MB for README, plus MP4/WebM fallback if the docs site supports it. Include alt text and exact capture command/tool in the asset metadata.
```

### Verification checklist

- Every frame has a single visible learning point.
- Error state and empty/pending state are included.
- Shareable state appears only if implemented in the playground.

## 4. AI-generated-rule safety carousel/comic

### Objective

Create an educational carousel showing that Neuron-JS is not “AI magic”; it is a deterministic guardrail layer for generated rules.

### Prompt

```text
Create a 5-slide technical comic carousel for @sebasoft/neuron-js about safe AI-generated JSON rules.

Objective:
Explain the safety story: LLMs can draft rules, but Neuron-JS makes execution safe only through schema validation, developer-owned registry boundaries, tests, approvals, rollback, deterministic execution, and explanation traces.

Layout:
Bridge/funnel narrative, 4:5 vertical carousel.
Slide 1: Problem — "LLMs can draft rules. They cannot be trusted blindly."
Slide 2: Gate 1 — "Schema validation catches malformed JSON scripts."
Slide 3: Gate 2 — "Developer registry limits the executable vocabulary."
Slide 4: Gate 3 — "Tests, approvals, and rollback before production."
Slide 5: Outcome — "Deterministic execution with an explanation trace."

Text labels:
- Main headline: "AI drafts. Neuron-JS verifies."
- Supporting labels: "Rules as data", "Schema-first", "Approved vocabulary", "Traceable decisions", "No arbitrary code"
- Footer: "@sebasoft/neuron-js — TypeScript-first JSON business rules"

Visual hierarchy:
Use a left-to-right or top-to-bottom safety-gate sequence. The LLM draft starts as amber/pending, invalid paths are rose and blocked, valid path turns emerald after validation, deterministic execution is cyan, explanation trace is violet.

Style:
Technical comic, not childish. Clean panels, limited characters if any, focus on artifacts: JSON card, schema gate, registry box, test checklist, approval stamp, trace rows. Use dark theme and precise labels.

Negative constraints:
No robot savior imagery. No claim that AI-generated rules are safe automatically. No fake metrics. No vague "autonomous business logic" promise. Do not depict non-technical users publishing rules without review.

Reproducibility notes:
Each slide must include editable text layers or markdown captions. Include alt text per slide. Keep same palette, typography, and engine proof language as visual-proof-system.md.
```

### Verification checklist

- The carousel explicitly blocks unsafe generation.
- It includes review/approval/rollback, not only validation.
- It reinforces deterministic execution and explanation trace.

## 5. README proof strip

### Objective

Create a compact README strip that makes the trust story visible in one glance.

### Prompt

```text
Create a compact README proof strip for @sebasoft/neuron-js.

Objective:
Give README visitors immediate visual proof that Neuron-JS validates JSON rules, executes deterministic decisions, explains traces, and supports honest benchmarks/playground proof.

Layout:
Wide strip, 5:1 or 4:1 aspect ratio, export as SVG and PNG.
Four panels across the strip:
1. Validate
2. Execute
3. Explain
4. Compare
Each panel has one artifact: validation error/pass row, execution result card, trace row, benchmark chart placeholder or real chart if measured data exists.

Text labels:
- Main title: "JSON rules you can validate, run, and explain"
- Panel 1: "Validate: schema-first checks"
- Panel 2: "Execute: deterministic Synapse run"
- Panel 3: "Explain: trace why it matched"
- Panel 4: "Compare: measured benchmarks only"
- Footnote if benchmark data is pending: "Benchmark slot shown as structure only until measured data is available."

Visual hierarchy:
The strip must be readable at README width. Use large panel titles, small but legible monospace snippets, and clear iconography based on artifacts, not generic symbols. Use cyan as the connecting thread, emerald for valid states, rose for error examples, violet for trace, amber for benchmark methodology.

Style:
Dark product evidence strip, technical but clean. No decorative background beyond a faint grid. Sharp, inspectable mini-panels.

Negative constraints:
Do not include fake benchmark values. Do not include tiny unreadable JSON blocks. Do not use badges that imply verified metrics without source data. Avoid generic SaaS hero art.

Reproducibility notes:
Store source file under docs/benchmarks/assets/generated/ or docs/public/img/ when finalized. Include alt text in README integration. If using real chart data, include source path, Node version, package versions, and commit SHA in hidden SVG metadata or adjacent markdown.
```

### Verification checklist

- Works at README width.
- Uses real data or clearly non-numeric placeholders.
- Has an alt-text-ready description.

## Downstream asset tasks recommended

1. Generate `explainability-trace-diagram` as standalone SVG/HTML once docs wording is final.
2. Generate `README-proof-strip` after selecting whether it will use non-numeric proof structure or real benchmark data.
3. Generate `benchmark-chart-throughput`, `benchmark-chart-cold-start`, `benchmark-chart-bundle-size`, `benchmark-chart-validation-overhead`, and `benchmark-chart-explanation-overhead` only after benchmark harness outputs real data.
4. Capture `playground-demo-gif-storyboard` from the actual playground once validation, trace, errors, and shareable state are implemented.
5. Generate `ai-rule-safety-carousel` as social proof after review of copy/legal risk around AI-generated rules.
