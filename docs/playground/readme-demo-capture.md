# README playground demo capture specification

Status: capture contract for the future Neuron-JS playground. The repository does not currently contain a `docs/playground/` implementation, so this page fixes the demo route, selectors, storyboard, output files, and data-integrity checks needed before capture automation is unblocked.

Source of record:

- the Neuron-JS growth plan (internal research), `NJS-GROWTH-07` lines 294-318: proof assets must include benchmarks, playground, visual explanation, and a README GIF when the playground is stable.
- internal marketing/benchmark research, lines 160-174: live demos require browser playground, shareable URLs, explain trace panel, README GIF, and optional visual rule builder.
- internal social-demand research, lines 160-169: social proof should show playground validation, explanation traces, before/after logic, and AI-generated rule validation.
- Runnable fixture source: `examples/pricing-rules/rules.json`, `examples/pricing-rules/input.json`, and `examples/pricing-rules/expected-output.json`.

Do not record or publish this asset until the playground renders the fixture data below and the capture command can validate the result against `examples/pricing-rules/expected-output.json`.

## Capture status

Blocked on playground implementation, not on missing planning.

Required future command:

```sh
yarn capture:playground-readme --example pricing-rules --format mp4,gif
```

Required future outputs:

```text
docs/benchmarks/assets/generated/playground-readme-demo.mp4
docs/benchmarks/assets/generated/playground-readme-demo.gif
docs/benchmarks/assets/generated/playground-readme-demo.metadata.json
```

The metadata JSON must include:

- capture command.
- git commit SHA.
- package version.
- Node version.
- browser name and version.
- source fixture paths.
- output dimensions and duration.
- validation result comparing the visible result panel to `examples/pricing-rules/expected-output.json`.

## Playground route contract

Canonical capture route:

```text
/playground/?example=pricing-rules&capture=readme
```

Required route behavior:

1. Load the pricing example without user interaction.
2. Render deterministic panels in the same order on every run.
3. Encode the loaded example in shareable URL state.
4. Disable random animation timing when `capture=readme` is present.
5. Use stable selectors from this page so browser automation can assert content before recording.

Recommended shareable URL state:

```text
/playground/?example=pricing-rules&state=<base64url-json>&capture=readme
```

The decoded state must contain only serializable JSON data:

```json
{
  "example": "pricing-rules",
  "scriptPath": "examples/pricing-rules/rules.json",
  "inputPath": "examples/pricing-rules/input.json",
  "expectedOutputPath": "examples/pricing-rules/expected-output.json"
}
```

## Stable selectors

Use `data-testid` for assertions and `data-capture-step` for timeline control.

| Selector | Required content | Capture step |
| --- | --- | --- |
| `[data-testid="playground-root"]` | Whole playground shell | all |
| `[data-testid="example-select"]` | Active example label: `pricing-rules` | 1 |
| `[data-testid="rule-json-panel"]` | Pretty-printed `examples/pricing-rules/rules.json` | 2 |
| `[data-testid="input-json-panel"]` | Pretty-printed `examples/pricing-rules/input.json` | 3 |
| `[data-testid="validation-status"]` | `Validation: passed` for the canonical run | 4 |
| `[data-testid="validation-errors"]` | Empty state: `No validation errors` | 4 |
| `[data-testid="trace-panel"]` | Ordered explanation trace rows | 5 |
| `[data-testid="trace-row-vip-order-discount"]` | Highlighted matched rule `vip-order-discount` | 5 |
| `[data-testid="result-panel"]` | `ok: true`, `rulesExecuted: 1`, `finalTotal: 105`, `discountAmount: 20` | 6 |
| `[data-testid="share-url"]` | Shareable URL containing `example=pricing-rules` | 7 |

Required trace classes:

| Class | Meaning |
| --- | --- |
| `.trace-row--matched` | Rule or condition matched. |
| `.trace-row--failed` | Rule or condition failed. |
| `.trace-row--focused` | Current row during capture. |
| `.trace-row--muted` | Non-current rows during capture. |

## Canonical visible data

Rule fixture:

```json
{
  "id": "pricing-rules-demo",
  "rules": [
    {
      "id": "vip-order-discount",
      "type": "simple_rule",
      "conditions": ["minimum-cart-subtotal >= 100"],
      "actions": ["apply_discount 16%"]
    }
  ]
}
```

Input fixture:

```json
{
  "messages": [],
  "state": {
    "cart": { "subtotal": 125, "currency": "USD" },
    "customer": { "segment": "vip" }
  }
}
```

Expected result fixture:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "finalTotal": 105,
  "discountAmount": 20,
  "messages": ["Applied 16% discount: -20"]
}
```

These visible values are backed by the runnable `examples/pricing-rules/run.ts` path. Capture automation must run the example or import the same fixture data before recording.

## README-safe storyboard

Target duration: 8-12 seconds.

Target dimensions:

- MP4: `1280x720`, H.264, under 8 MB when practical.
- GIF: `960x540`, 12 FPS, under 5 MB when practical.

Timeline:

| Time | Shot | Assertion before capture proceeds |
| --- | --- | --- |
| 0.0-1.0s | Playground opens with `pricing-rules` selected. | `[data-testid="example-select"]` contains `pricing-rules`. |
| 1.0-2.5s | Rule JSON panel focuses `vip-order-discount`. | `[data-testid="rule-json-panel"]` contains `vip-order-discount`. |
| 2.5-4.0s | Input JSON panel focuses `cart.subtotal: 125`. | `[data-testid="input-json-panel"]` contains `125`. |
| 4.0-5.5s | Validation status turns green. | `[data-testid="validation-status"]` contains `passed`. |
| 5.5-7.5s | Trace panel highlights the matched condition and action. | `[data-testid="trace-row-vip-order-discount"]` has `.trace-row--matched`. |
| 7.5-9.5s | Result panel displays deterministic output. | `[data-testid="result-panel"]` contains `finalTotal: 105`. |
| 9.5-11.0s | Shareable URL is shown/copied statefully. | `[data-testid="share-url"]` contains `example=pricing-rules`. |

No benchmark chart, throughput claim, or performance language belongs in this demo. It proves inspectability, validation, deterministic execution, explanation, and shareability only.

## Future automation requirements

Recommended implementation stack:

- Playwright for browser launch, assertions, and MP4/webm recording.
- `ffmpeg` for README-safe GIF conversion.
- A script at `scripts/capture-playground-readme.ts` wired to `yarn capture:playground-readme`.

Automation sequence:

1. Build the docs/playground site.
2. Start the preview server on a deterministic local port.
3. Open `/playground/?example=pricing-rules&capture=readme`.
4. Assert all selectors above are present.
5. Assert result-panel values match `examples/pricing-rules/expected-output.json`.
6. Record the MP4.
7. Convert a GIF from the same recording.
8. Write metadata JSON beside the output files.
9. Exit non-zero if any selector, fixture value, output file, or metadata field is missing.

## README integration rule

README may embed the generated asset only after all conditions are true:

1. The playground route exists and is linked from the docs.
2. Capture automation passes locally and in CI or documented release workflow.
3. The visible rule/input/result pair is validated against the runnable example fixtures.
4. The README alt text describes the demo without claiming benchmark superiority.
5. The asset metadata file is committed beside the generated MP4/GIF.

Suggested alt text:

```text
Neuron-JS playground demo showing pricing rule JSON, input JSON, validation passed, matched explanation trace, deterministic discount result, and shareable state.
```
