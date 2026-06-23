# AI-generated-rule safety carousel prompt

Source storyboard: `docs/benchmarks/assets/storyboard/ai-rule-safety-carousel.md`
Source system: `docs/benchmarks/visual-proof-system.md`
Prompt kit source: `docs/benchmarks/prompt-kit.md`, section 4.

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

## Per-slide prompt split

Use the full prompt above when the image tool supports multi-image carousel generation. If it only supports one image at a time, generate each slide with the same `Objective`, `Visual system`, `Format`, and `Negative constraints`, replacing the slide section with the target slide only.
