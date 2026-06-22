# NJS-GROWTH-07 benchmark asset folder

Recommended folder for visual proof assets:

```text
docs/benchmarks/assets/
  README.md
  source-data/
    benchmark-results.example.json
    benchmark-results.schema.json
  prompts/
    benchmark-infographic.md
    explainability-trace-diagram.md
    playground-readme-gif-storyboard.md
    ai-rule-safety-carousel.md
    readme-proof-strip.md
  storyboard/
    playground-readme-gif.md
    ai-rule-safety-carousel.md
  generated/
    benchmark-chart-throughput.svg
    benchmark-chart-cold-start.svg
    benchmark-chart-bundle-size.svg
    benchmark-chart-validation-overhead.svg
    benchmark-chart-explanation-overhead.svg
    explainability-trace-diagram.svg
    readme-proof-strip.svg
```

## Folder rules

- `source-data/` stores benchmark input data and schemas only. Generated assets must cite these files when they include measurements.
- `prompts/` stores frozen prompts copied or split from `docs/benchmarks/prompt-kit.md` for repeatable generation. The benchmark chart prompt set lives at `prompts/benchmark-chart-prompts.md`; the methodology card prompt lives at `prompts/methodology-infographic.md`.
- `storyboard/` stores GIF/clip scripts, frame lists, and capture notes.
- `generated/` stores exported SVG/PNG/GIF/MP4 assets.

## Data integrity rules

- Do not place fabricated benchmark results in `source-data/`.
- Example files must be named `.example.*` and must use obviously non-claiming values or schema-only structures.
- Real benchmark files must include `node_version`, `package_version`, `commit_sha`, `warmup_iterations`, and `measured_iterations`.
- Any generated benchmark chart must name its source data file in adjacent metadata or in the SVG metadata block.

## Generated assets

Current generated proof assets:

- `generated/methodology-card.svg`: 16:9 methodology card explaining no-fabricated-benchmark rules without performance numbers.
- `generated/explainability-trace-diagram.svg`: 16:9 SVG diagram showing business input -> schema validation -> registry -> rule evaluation -> match/fail trace -> deterministic decision.
- `generated/explainability-trace-diagram.html`: browser preview wrapper with caption and alt text.
- `generated/explainability-trace-diagram.md`: source grounding, caption, alt text, integrity notes, and export notes.

## Accessibility rules

Every final asset needs:

- Alt text.
- Source data link when metrics appear.
- Color contrast check notes.
- Export dimensions.
- Creation date and generator/tool used.

## README integration rule

The README proof strip should not be merged into the README until either:

1. it contains no benchmark numbers and is clearly a proof-structure asset; or
2. it uses real benchmark output from the harness and cites the exact source data.
