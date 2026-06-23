# Playground README GIF storyboard

Primary spec: `docs/playground/readme-demo-capture.md`.

Status: blocked on playground implementation. This storyboard is ready for capture automation once `/playground/?example=pricing-rules&capture=readme` exists.

## Fixture lock

Use only the runnable pricing fixture:

- rules: `examples/pricing-rules/rules.json`
- input: `examples/pricing-rules/input.json`
- expected output: `examples/pricing-rules/expected-output.json`
- runnable verification: `node examples/pricing-rules/run.ts` after `yarn build`

Canonical visible result:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "finalTotal": 105,
  "discountAmount": 20,
  "messages": ["Applied 16% discount: -20"]
}
```

## Shot list

| Step | Duration | Frame | Required selector/assertion |
| --- | ---: | --- | --- |
| 1 | 1.0s | Playground shell loads with Pricing Rules selected. | `[data-testid="example-select"]` contains `pricing-rules`. |
| 2 | 1.5s | Rule JSON panel highlights `vip-order-discount`. | `[data-testid="rule-json-panel"]` contains `vip-order-discount`. |
| 3 | 1.5s | Input JSON panel highlights `cart.subtotal = 125`. | `[data-testid="input-json-panel"]` contains `125`. |
| 4 | 1.5s | Validation state shows passed and zero errors. | `[data-testid="validation-status"]` contains `passed`; `[data-testid="validation-errors"]` contains `No validation errors`. |
| 5 | 2.0s | Trace highlights the matched rule and condition. | `[data-testid="trace-row-vip-order-discount"]` has `.trace-row--matched`. |
| 6 | 2.0s | Result panel displays `finalTotal: 105` and discount. | `[data-testid="result-panel"]` contains `finalTotal: 105` and `discountAmount: 20`. |
| 7 | 1.5s | Share URL appears with encoded state. | `[data-testid="share-url"]` contains `example=pricing-rules`. |

## Capture command contract

Future command:

```sh
yarn capture:playground-readme --example pricing-rules --format mp4,gif
```

Future outputs:

```text
docs/benchmarks/assets/generated/playground-readme-demo.mp4
docs/benchmarks/assets/generated/playground-readme-demo.gif
docs/benchmarks/assets/generated/playground-readme-demo.metadata.json
```

The asset must not include benchmark numbers, rank claims, or performance language.
