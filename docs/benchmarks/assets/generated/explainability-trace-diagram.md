# Explainability trace diagram metadata

Asset: `explainability-trace-diagram`

Files:

- `docs/benchmarks/assets/generated/explainability-trace-diagram.svg`
- `docs/benchmarks/assets/generated/explainability-trace-diagram.html`

Caption:

Neuron-JS turns serializable business-rule JSON into deterministic decisions by validating inputs, constraining execution through a developer-owned registry, and exposing a match/fail explanation trace for review.

Alt text:

Diagram showing business input and rule JSON flowing through schema validation, developer registry, deterministic Synapse evaluation, result output, match/fail explanation trace, and audit-ready decision; a dashed branch shows validation errors returning to a repair loop.

Source grounding:

- `chaos-vault/50-research/neuron-js-growth-plan.md`, NJS-GROWTH-07 lines 294-318: proof assets objective and README visual proof baseline.
- `chaos-vault/50-research/neuron-js-marketing-assets-benchmark.md`, lines 87-100 and 160-174: honest benchmark proof, playground, trace panel, README GIF pattern.
- `chaos-vault/50-research/neuron-js-social-demand-gap.md`, lines 184-210: target pains and wedge around schema validation, deterministic guardrails, and explanation traces.
- `docs/benchmarks/visual-proof-system.md`: palette, typography, diagram rules, brand guardrails, and canonical trace flow.
- `docs/benchmarks/prompt-kit.md`: explainability trace diagram prompt, labels, branches, and negative constraints.
- `docs/schemas-validation-explainability.md`: validation, deterministic execution, normalized output, and explanation trace contracts.

Integrity notes:

- This asset contains no benchmark numbers, winner claims, speed claims, or unsupported performance claims.
- The diagram does not show arbitrary code execution or unsafe business-user publication.
- The registry is visible as the control boundary for approved actions, conditions, parameters, and rules.

Export notes:

- SVG canvas: 1600 x 900, 16:9.
- The SVG is directly embeddable in docs/README and can be exported to PNG with any SVG-capable browser or renderer.
- The HTML file previews the SVG with caption and alt text.
