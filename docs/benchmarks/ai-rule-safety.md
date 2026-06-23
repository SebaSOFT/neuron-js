# AI-rule safety

LLMs are great at *drafting* JSON business rules — and that's exactly the risk. A
plausible-looking rule can still encode the wrong field, the wrong threshold, or the wrong
action. Neuron-JS exists so AI-drafted rules become **safe to run**: schema-validated,
constrained to a developer-owned vocabulary, reviewable like code, and explainable after the
fact.

> AI drafts. Neuron-JS verifies.

## 1. AI can draft rules

A plausible JSON rule can still encode the wrong assumption, field, or action — it is not
production-ready on its own.

![A developer inspects an amber LLM-generated JSON rule card. A small rose warning marker highlights a risky business assumption, with text saying the draft is not production-ready.](./assets/generated/ai-rule-safety-carousel-1.svg)

## 2. Validate before runtime

Schema-first checks (`validateScript`) reject malformed scripts before they ever execute, and
return the exact JSON path to fix.

![A JSON rule passes through a schema validation gate. One invalid path is blocked in rose with an exact JSON path, while a corrected rule exits with an emerald pass marker.](./assets/generated/ai-rule-safety-carousel-2.svg)

## 3. Constrain what can run

A developer-owned registry defines the approved actions, conditions, parameters, and rules.
Anything outside that vocabulary simply cannot execute — no arbitrary code.

![A validated rule enters a developer-owned registry boundary. Approved action and condition tiles connect in cyan, while an unapproved action is blocked outside the boundary.](./assets/generated/ai-rule-safety-carousel-3.svg)

## 4. Review like code

Generated rules are serializable data, so they go through the same governance as code: tests,
owner approval, and rollback — never automatic AI approval.

![A generated rule card sits beside a review checklist showing tests, owner approval, and rollback snapshot. The visual emphasizes governance before production use.](./assets/generated/ai-rule-safety-carousel-4.svg)

## 5. Then execute deterministically

Synapse runs the approved rule path deterministically, and the explanation trace shows why the
decision matched or failed — ready for audit, logs, or a support ticket.

![An approved JSON rule flows into a Synapse execution node. A result card and violet explanation trace rows show why the rule matched and what action ran, with the caption "AI drafts. Neuron-JS verifies."](./assets/generated/ai-rule-safety-carousel-5.svg)

## In short

`Validate → constrain → test → approve → execute → explain.` Deterministic workflow logic with
auditability is the guardrail that makes AI-assisted business rules safe to ship.
