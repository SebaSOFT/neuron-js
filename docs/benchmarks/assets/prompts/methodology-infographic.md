# Methodology infographic prompt

This prompt is safe to use before benchmark data exists because it contains no performance numbers.

Final draft path:

- `docs/benchmarks/assets/generated/methodology-card.svg`

```text
Create a dark technical methodology infographic card for @sebasoft/neuron-js benchmarks.

Objective:
Explain the honest benchmark rules before any performance claims are published.

Headline:
"Benchmark proof without fake numbers"

Layout:
Six evidence gates in a 16:9 dashboard card:
1. Same scenario
2. Same input size
3. Warmup before measurement
4. Real package versions
5. Commit SHA attached
6. Claims allowed only from actual benchmark output

Text constraints:
- Do not include performance numbers.
- Include this footnote: "Placeholder data is for wiring only. Public claims require result_kind=actual_benchmark, is_placeholder=false, claims_allowed=true."
- Include source note: "Methodology: docs/benchmarks/methodology.md"

Visual style:
Dark technical schematic, slate panels, faint grid, amber methodology accents, cyan source path highlight, emerald pass gates, rose blocked placeholder gate. No trophy icon, no fastest claim, no generic robot imagery.

Export:
16:9 docs/social card, plus editable SVG source.
```

Verification checklist:

- Contains no benchmark performance numbers.
- Shows the placeholder rejection rule.
- References `docs/benchmarks/methodology.md`.
- Works as a docs card and social explainer.
