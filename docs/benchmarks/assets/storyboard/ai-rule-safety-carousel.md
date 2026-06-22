# AI-generated rule safety carousel/comic

Asset taxonomy: `ai-rule-safety-carousel`
Status: script and generation prompts for review; no generated image asset yet.
Recommended surfaces: LinkedIn carousel, X image thread, GitHub discussion image set, docs proof-assets page.
Recommended format: 5 slides, 4:5 vertical carousel, 1080x1350 or 1200x1500.

## Source grounding

Source of record:

- `chaos-vault/50-research/neuron-js-growth-plan.md`, NJS-GROWTH-07 lines 294-318: proof assets must support benchmarks, playground, and visual explanation; README proof asset waits for stable proof.
- `chaos-vault/50-research/neuron-js-marketing-assets-benchmark.md`, lines 87-100 and 160-174: publish honest proof, live demos, trace panels, and README visual proof; do not overclaim without measured evidence.
- `chaos-vault/50-research/neuron-js-social-demand-gap.md`, lines 184-210: target the pain that LLM-generated rules are dangerous without validation/schemas and that developers need deterministic guardrails and explanations.
- `docs/benchmarks/visual-proof-system.md`, lines 13-23, 110-118, and 179-189: visual assets should communicate credibility, inspectability, determinism, and AI safety; AI-rule-safety carousel uses a bridge/funnel technical comic with safety gates; social slides need short copy and `@sebasoft/neuron-js`.
- `docs/benchmarks/prompt-kit.md`, lines 213-258: base prompt for the AI-generated-rule safety carousel.

Hindsight memory helped: no. Hindsight recall returned no relevant stored memories; this asset is grounded in the vault and repository files above.

## Positioning guardrails

Core message:

> AI can draft rule JSON, but production logic still needs schema validation, developer-owned vocabulary, tests, approvals, rollback, deterministic execution, and explanation traces.

Say:

- `AI drafts. Neuron-JS verifies.`
- `Rules as data, not arbitrary code.`
- `Validate -> constrain -> test -> approve -> execute -> explain.`
- `Deterministic workflow logic with auditability.`

Do not say:

- `AI-generated rules are safe automatically.`
- `Business users can publish arbitrary logic without developer review.`
- `Neuron-JS prevents every possible business-policy error.`
- `Faster`, `best`, or performance claims without measured benchmark output.
- Negative claims against competitors.

## Visual system

- Style: technical comic, dark proof-system UI, restrained cyberpunk glow, no childish mascot.
- Palette: slate background, cyan Neuron-JS path, emerald validation pass, violet trace/audit, amber pending LLM draft, rose blocked unsafe path.
- Typography: Inter/system UI for captions, JetBrains Mono/SFMono for JSON, trace labels, and schema paths.
- Composition: bridge/funnel sequence. Each slide moves a generated draft through one safety gate.
- Recurring artifacts: LLM draft card, JSON rule card, schema gate, registry boundary, test/approval checklist, Synapse execution node, explanation trace panel.
- Footer on every slide: `@sebasoft/neuron-js — TypeScript-first JSON business rules`.
- Accessibility: keep headline under 8 words, body under 35 words, high contrast, alt text per slide.

## 5-slide carousel script

### Slide 1 — AI drafts the rule

Headline: `AI can draft rules.`

Body copy: `But a plausible JSON rule can still encode the wrong assumption, wrong field, or wrong action.`

On-slide labels:

- `LLM draft`
- `Looks valid? Maybe.`
- `Not production-ready.`

Visual action:

A developer reviews an amber LLM output card containing a short JSON-like rule draft. One field is subtly suspicious: `customer.segment == "enterprise"` routes to `auto_approve_discount`. A rose warning dot marks the risky assumption, but the frame avoids panic imagery.

Purpose:

Introduce the risk without fearmongering: the issue is not AI itself; the issue is trusting generated business logic without controls.

Alt text:

`A developer inspects an amber LLM-generated JSON rule card. A small rose warning marker highlights a risky business assumption, with text saying the draft is not production-ready.`

### Slide 2 — Schema validation catches shape errors

Headline: `Validate before runtime.`

Body copy: `Schema-first checks reject malformed scripts before they reach execution.`

On-slide labels:

- `Schema validation`
- `blocked: unknown field`
- `repair path: conditions[0].operator`

Visual action:

The draft rule enters an emerald-and-rose validation gate. A malformed or unknown operator is blocked with a precise JSON path. A second corrected rule exits the gate as `schema: pass`.

Purpose:

Show that validation gives a concrete repair loop, not a vague failure state.

Alt text:

`A JSON rule passes through a schema validation gate. One invalid path is blocked in rose with an exact JSON path, while a corrected rule exits with an emerald pass marker.`

### Slide 3 — Registry limits executable vocabulary

Headline: `Constrain what can run.`

Body copy: `A developer-owned registry defines approved actions, conditions, parameters, and rules.`

On-slide labels:

- `developer registry`
- `approved vocabulary only`
- `no arbitrary code`

Visual action:

The validated rule reaches a registry boundary. Approved condition/action tiles are cyan and connected; an unapproved `auto_refund_all_orders` tile is outside the boundary and blocked by a rose dashed line.

Purpose:

Clarify Neuron-JS as a controlled execution layer, not a magic AI agent or arbitrary-code runtime.

Alt text:

`A validated rule enters a developer-owned registry boundary. Approved action and condition tiles connect in cyan, while an unapproved action is blocked outside the boundary.`

### Slide 4 — Tests, approval, and rollback

Headline: `Review like code.`

Body copy: `Generated rules still need tests, approval, ownership, and rollback before production use.`

On-slide labels:

- `test cases`
- `owner approval`
- `rollback ready`
- `sample structure only`

Visual action:

A checklist overlays the rule card: fixture tests pass, owner approval is pending then stamped approved, rollback snapshot is saved. No benchmark numbers or success-rate metrics appear.

Purpose:

Prevent overclaiming. Validation is necessary but not sufficient; governance completes the safety story.

Alt text:

`A generated rule card sits beside a review checklist showing tests, owner approval, and rollback snapshot. The visual emphasizes governance before production use.`

### Slide 5 — Deterministic execution with trace

Headline: `Then execute deterministically.`

Body copy: `Synapse runs the approved rule path, and the trace explains why the decision matched or failed.`

On-slide labels:

- `Synapse execution`
- `result: routed`
- `trace: condition matched`
- `audit-ready explanation`

Visual action:

The approved rule enters a cyan Synapse execution node. Output splits into a result card and violet trace rows: input field, condition, matched/failed status, action triggered. The final caption reads `AI drafts. Neuron-JS verifies.`

Purpose:

End on the product wedge: deterministic workflow logic with auditability, not probabilistic decisioning.

Alt text:

`An approved JSON rule flows into a Synapse execution node. A result card and violet explanation trace rows show why the rule matched and what action ran.`

## Single-master image generation prompt

```text
Create a 5-slide technical comic carousel for @sebasoft/neuron-js about safe AI-generated JSON business rules.

Objective:
Explain that LLMs can draft JSON rules, but production logic needs schema validation, developer-owned registry boundaries, tests, approvals, rollback, deterministic execution, and explanation traces. The tone should be credible and developer-specific, not fearful and not generic AI hype.

Format:
5 vertical carousel slides, 4:5 aspect ratio, designed for LinkedIn and X image threads. Keep each headline under 8 words and body text under 35 words. Include footer on every slide: "@sebasoft/neuron-js — TypeScript-first JSON business rules".

Visual system:
Dark technical comic with safety gates. Use slate background, raised dark panels, faint grid, Inter/system UI captions, JetBrains Mono/SFMono JSON labels. Use cyan for the Neuron-JS execution path, emerald for validation/pass, violet for trace/audit, amber for pending LLM draft, rose for blocked invalid paths. Avoid mascots, magic wand imagery, robot savior imagery, generic SaaS gradients, and fearmongering visuals.

Slide 1:
Headline: "AI can draft rules."
Body: "But a plausible JSON rule can still encode the wrong assumption, wrong field, or wrong action."
Scene: Developer inspects an amber LLM output card containing a short JSON-like rule draft. One field is subtly suspicious: customer.segment == "enterprise" routes to auto_approve_discount. Add labels "LLM draft", "Looks valid? Maybe.", and "Not production-ready." Rose warning marker only; no panic imagery.
Alt text: "A developer inspects an amber LLM-generated JSON rule card. A small rose warning marker highlights a risky business assumption, with text saying the draft is not production-ready."

Slide 2:
Headline: "Validate before runtime."
Body: "Schema-first checks reject malformed scripts before they reach execution."
Scene: Draft rule enters an emerald-and-rose validation gate. One invalid path is blocked with exact label "blocked: conditions[0].operator". A corrected rule exits as "schema: pass". Show repair loop, not dead-end failure.
Alt text: "A JSON rule passes through a schema validation gate. One invalid path is blocked in rose with an exact JSON path, while a corrected rule exits with an emerald pass marker."

Slide 3:
Headline: "Constrain what can run."
Body: "A developer-owned registry defines approved actions, conditions, parameters, and rules."
Scene: Validated rule reaches a registry boundary. Approved condition/action tiles are cyan and connected. An unapproved action tile, "auto_refund_all_orders", is outside the boundary and blocked by a rose dashed line. Include labels "developer registry", "approved vocabulary only", and "no arbitrary code".
Alt text: "A validated rule enters a developer-owned registry boundary. Approved action and condition tiles connect in cyan, while an unapproved action is blocked outside the boundary."

Slide 4:
Headline: "Review like code."
Body: "Generated rules still need tests, approval, ownership, and rollback before production use."
Scene: Checklist beside the rule card: "test cases", "owner approval", "rollback ready". Approval stamp is developer/owner review, not automatic AI approval. Add small note "sample structure only". Do not show fake percentages, fake pass rates, or benchmark numbers.
Alt text: "A generated rule card sits beside a review checklist showing tests, owner approval, and rollback snapshot. The visual emphasizes governance before production use."

Slide 5:
Headline: "Then execute deterministically."
Body: "Synapse runs the approved rule path, and the trace explains why the decision matched or failed."
Scene: Approved rule enters a cyan Synapse execution node. Output splits into a result card and violet trace rows showing input field, condition, matched/failed status, and action triggered. Final caption: "AI drafts. Neuron-JS verifies."
Alt text: "An approved JSON rule flows into a Synapse execution node. A result card and violet explanation trace rows show why the rule matched and what action ran."

Negative constraints:
Do not claim AI-generated rules are safe automatically. Do not depict non-technical users publishing generated rules without review. Do not make benchmark, speed, superiority, or competitor-negative claims. Do not show arbitrary code execution. Do not include fake metrics or lorem ipsum.
```

## Channel fit

- LinkedIn: strongest fit. Use as a 5-slide carousel for engineering leads, developer tooling audiences, and AI-workflow builders. Caption angle: `LLMs can draft business rules. The production question is: what validates, constrains, tests, executes, and explains them?`
- X: good fit as a 5-image thread. Lead with Slide 1 or Slide 5. Keep post copy concrete and avoid broad AI-safety rhetoric.
- GitHub discussion/docs: useful as a proof-system storyboard before generating final images. Pair with `docs/benchmarks/visual-proof-system.md` and `docs/benchmarks/prompt-kit.md`.

## Review checklist

- [x] Communicates the risk of LLM-generated rules without fearmongering.
- [x] Shows Neuron-JS guardrails: schema validation, registry constraints, tests, approvals, rollback, deterministic execution, trace.
- [x] Avoids benchmark numbers and performance claims.
- [x] Avoids competitor-negative claims.
- [x] Includes text, visual action, style constraints, and alt text for each slide.
- [x] Uses source-grounded product language: TypeScript-first, explainable, schema-validatable JSON business rules.
