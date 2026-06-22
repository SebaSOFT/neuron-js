# NJS-GROWTH-07 visual proof system

Status: design foundation for downstream benchmark, playground, README, and social proof assets.

Source of record:

- `chaos-vault/50-research/neuron-js-growth-plan.md`, `NJS-GROWTH-07` lines 294-318: proof assets must cover benchmarks, playground, and visual explanation.
- `chaos-vault/50-research/neuron-js-marketing-assets-benchmark.md`, lines 87-100 and 160-174: publish honest benchmarks, shareable playground proof, trace panel, README GIF.
- `chaos-vault/50-research/neuron-js-social-demand-gap.md`, lines 184-210: trust wedge is TypeScript-first, explainable, schema-validatable JSON business rules for AI-assisted software and workflow automation.

Do not use this system to invent performance numbers. Benchmark visuals must use measured data from the benchmark harness only.

## Brand proof thesis

Neuron-JS should look like deterministic infrastructure, not generic SaaS marketing.

The visual system must communicate four claims:

1. Credible: honest methodology, visible competitor set, clear metric definitions.
2. Inspectable: rule JSON, input JSON, result, validation errors, and explanation trace are shown as first-class panels.
3. Deterministic: decisions flow through explicit validation and execution gates, not probabilistic magic.
4. AI-safe: generated rules are constrained by schemas, registry vocabulary, previews, approvals, tests, and rollback.

## Audience and surfaces

Primary audience:

- TypeScript developers choosing between rule engines, hand-coded conditions, or workflow platforms.
- Engineering leads evaluating whether dynamic JSON rules can be trusted.
- AI workflow builders who need deterministic guardrails after LLM extraction or classification.

Primary surfaces:

- `docs/benchmarks/` pages.
- `docs/playground/` or future playground package/site.
- README proof strip and short GIF.
- Social cards and carousels for X/LinkedIn/GitHub discussions.

## Palette

Use a dark technical base with precise semantic accent colors. Cyberpunk energy is allowed only as a restrained proof-of-system glow, not decoration.

| Token | Hex | Role | Usage |
| --- | --- | --- | --- |
| `proof-bg` | `#020617` | slate black | page/card background, chart canvas |
| `proof-panel` | `#0f172a` | raised panel | JSON panes, chart cards, trace rows |
| `proof-panel-2` | `#111827` | secondary panel | nested code and metadata |
| `proof-grid` | `#1e293b` | grid lines | faint chart grids, diagram scaffolds |
| `proof-text` | `#e5e7eb` | primary text | labels, titles, high-contrast body text |
| `proof-muted` | `#94a3b8` | secondary text | captions, method notes, axis labels |
| `proof-cyan` | `#22d3ee` | Neuron-JS / inspectability | main highlight, active flow, trace focus |
| `proof-emerald` | `#34d399` | validation/pass | schema pass, deterministic execution success |
| `proof-violet` | `#a78bfa` | explainability | trace and audit chain |
| `proof-amber` | `#fbbf24` | benchmark method | methodology callouts, caution labels |
| `proof-rose` | `#fb7185` | errors/safety | validation errors, unsafe generation, blocked paths |

Color rules:

- Never encode benchmark rank by arbitrary rainbow colors. Use a stable engine mapping.
- Use color plus labels/patterns, never color alone.
- Keep chart backgrounds dark and data marks high contrast.
- For accessibility, maintain WCAG AA contrast for every text label.

## Engine color mapping

Use this order consistently across all benchmark assets:

| Engine | Color | Stroke/pattern note |
| --- | --- | --- |
| `@sebasoft/neuron-js` | `proof-cyan` / `#22d3ee` | solid line, highlighted but not oversized |
| `json-rules-engine` | `proof-violet` / `#a78bfa` | solid line, equal weight |
| `json-logic-js` / JsonLogic | `proof-amber` / `#fbbf24` | dashed line or patterned bar |
| hand-coded TypeScript | `proof-emerald` / `#34d399` | solid line, marked as baseline not product competitor |
| `rule-engine-js` or `rulepilot` | `proof-muted` / `#94a3b8` | dotted or lower-emphasis stroke |

Do not visually imply Neuron-JS wins unless the measured benchmark data proves it.

## Typography

Preferred stack:

- UI and headings: `Inter`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- Code and metric labels: `JetBrains Mono`, `SFMono-Regular`, `Menlo`, `Consolas`, monospace.

Type scale:

| Token | Size | Weight | Usage |
| --- | --- | --- | --- |
| `display` | 40-48px | 700 | hero/README strip headline |
| `title` | 28-32px | 700 | infographic title |
| `section` | 18-22px | 650 | panel headers |
| `body` | 14-16px | 400-500 | explanatory copy |
| `mono-label` | 12-13px | 500 | JSON keys, axis labels, trace node labels |
| `micro` | 10-11px | 500 | metadata, commit SHA, version, methodology footnotes |

Rules:

- Keep headlines concrete: `Validate -> Execute -> Explain`, not vague claims.
- Use code labels where the source artifact is code or JSON.
- Use short captions that explain what is inspectable.

## Composition system

Use a three-layer composition model:

1. Evidence layer: charts, JSON panes, trace nodes, validation rows.
2. Interpretation layer: small annotations explaining what the viewer can trust.
3. Method layer: metric schema, versions, input sizes, commit SHA, and no-fabrication note.

Preferred layouts by asset:

| Asset | Layout | Style |
| --- | --- | --- |
| benchmark infographic pack | dashboard + comparison matrix | technical schematic, dark lab grid |
| explainability trace diagram | linear progression or structural breakdown | dark architecture diagram |
| playground README GIF storyboard | comic-strip sequence + UI wireframe | crisp product UI, low ornament |
| AI-generated-rule safety carousel | bridge or funnel | technical comic with safety gates |
| README proof strip | bento-grid / proof strip | compact dark product evidence card |

## Diagram style

Trace and architecture diagrams should use dark SVG-style panels:

- Rounded rectangles with 6-8px radius.
- 1.5px strokes.
- Faint 40px grid background.
- Arrows behind boxes.
- Dashed rose lines for blocked unsafe paths.
- Emerald check markers for validation pass.
- Violet audit chain for explainability trace.
- Cyan active path for Neuron-JS execution.

Canonical trace flow:

```text
Rule JSON -> Schema validation -> Developer registry -> Synapse execution -> Result -> Explanation trace -> Audit/review
```

AI-safety flow:

```text
LLM draft -> schema validation -> registry vocabulary check -> test cases -> human approval -> deterministic execution
                     \-> validation errors -> repair loop
```

## Chart rules

Benchmark visuals must display method before claim.

Required chart metadata:

- scenario: `pricing-discount`, `eligibility-approval`, or `workflow-routing`.
- input size: smoke / small / medium / large.
- warmup iterations.
- measured iterations.
- Node version.
- package versions.
- commit SHA.
- benchmark date.

Allowed metrics:

- throughput decisions per second.
- p50 and p95 milliseconds.
- cold start milliseconds.
- bundle size minified bytes.
- validation overhead milliseconds.
- explanation overhead milliseconds.

Forbidden chart behavior:

- No invented numbers.
- No unlabeled axes.
- No “fastest” badge without measured proof.
- No 3D charts.
- No cropped axes that exaggerate differences.
- No benchmark screenshot without methodology metadata.

## Social-card constraints

Use these constraints for X/LinkedIn/GitHub visual posts:

- Default social aspect: 16:9 for link cards, 1:1 for feed cards, 4:5 for LinkedIn carousel slides.
- Maximum headline length: 8 words.
- Maximum body text per slide: 35 words.
- Minimum font size: 28px for headline on 1200px-wide assets; 18px for labels.
- Always include the package name `@sebasoft/neuron-js`.
- Add a footnote if numbers are benchmark-specific: `Measured on <node_version>, <commit_sha>. See methodology.`
- For unreleased/prototype assets, include `sample structure only — replace with measured data`.

## README proof strip recommendation

Recommended asset folder:

```text
docs/benchmarks/assets/
  README.md
  source-data/
  generated/
  prompts/
  storyboard/
```

README strip design:

- Aspect ratio: wide 5:1 or 4:1, exportable as SVG/PNG and embeddable in README.
- Sections: `Validate`, `Execute`, `Explain`, `Compare`.
- Must show one actual tiny trace row or JSON snippet, not generic icons only.
- If benchmark numbers are not final, use placeholder labels such as `throughput`, `cold start`, `bundle size` without fake values.

## Accessibility and QA gates

Before an asset is approved:

- Verify text contrast reaches WCAG AA minimum.
- Check legibility at 50% scale for README and social use.
- Ensure keyboard-visible UI states exist for any playground capture.
- Add alt text for every exported image.
- Keep all chart data traceable to a source CSV/JSON and commit SHA.
- Confirm every metric label matches the benchmark schema exactly.

## Brand guardian checks

Reject assets that:

- Make Neuron-JS look like a no-code magic builder.
- Hide the developer-owned registry or schema validation story.
- Use fake benchmark numbers or decorative data.
- Use generic robot/AI imagery without validation and deterministic execution gates.
- Overpromise business-user rule authoring without review, tests, and rollback.

Approve assets that make the trust story visible: rules are data, execution is deterministic, validation is schema-first, traces are inspectable, and AI generation is constrained.
