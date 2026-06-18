# Drafting fields

Title: Neuron-JS vs json-rules-engine: choosing the right JSON rules engine

Alias: neuron-js-vs-json-rules-engine

Description: A practical migration guide for teams comparing Neuron-JS with json-rules-engine, focused on TypeScript ownership, validation, explainability, and deterministic JSON business rules.

Tags: neuron-js, typescript, rules-engine, json-rules-engine, migration, business-rules, ai-agents

# Markdown body

## The short version

`json-rules-engine` is the established Node.js default for JSON rules. It is mature, recognizable, and built around facts, conditions, events, and rule priorities.

Neuron-JS takes a narrower position: **JSON business rules for TypeScript systems that need validation before runtime and explanation after execution**.

That difference matters when business rules become product infrastructure instead of a helper library.

Use `json-rules-engine` when your system already thinks in facts and events, and the existing ecosystem fit is more important than a built-in validation and explanation contract.

Use Neuron-JS when the rule layer must be:

- stored as JSON,
- generated or edited outside deployment cycles,
- validated before runtime,
- executed through an approved TypeScript registry,
- explained for support, audit, or tests.

## What each tool is optimized for

`json-rules-engine` gives teams a known model:

- facts describe the current world,
- conditions decide whether something matches,
- events describe what happened,
- priorities help control rule order.

That is a good model. If your business logic already lives there and works, migration is not automatically valuable.

Neuron-JS is optimized for a different pressure point: **safe dynamic logic in TypeScript applications**.

The core model is:

- `Neuron` owns the approved rule vocabulary,
- `Synapse` executes a serializable script,
- schemas validate generated or stored JSON,
- output summaries and explanation traces make the decision reviewable.

That makes it useful when rules become a governance problem, not only an execution problem.

## When Neuron-JS is the better fit

Choose Neuron-JS when you need a tighter contract around JSON business rules.

Good signs:

- AI agents generate candidate rules and you need to reject malformed scripts before execution.
- Product or operations teams need rule changes without a code deployment.
- The application must keep a constrained vocabulary of approved conditions and actions.
- Support needs to answer “why did this decision happen?” with a trace, not a guess.
- Backend and browser code need the same deterministic rule definition.

The point is not to be more abstract. The point is to make dynamic logic safer.

## When json-rules-engine is the better fit

Keep or choose `json-rules-engine` when:

- facts, events, and priorities match your mental model,
- your current rule assets are stable,
- the team values ecosystem familiarity over a different contract,
- validation and explanation can remain project-owned,
- migration would add risk without real operational gain.

A migration that does not improve safety, clarity, or operating speed is not engineering. It is churn.

## Migration pattern

Do not translate keywords mechanically. Translate the decision.

A `json-rules-engine` rule often looks like this:

```json
{
  "conditions": {
    "all": [
      { "fact": "customerTier", "operator": "equal", "value": "gold" },
      { "fact": "cartTotal", "operator": "greaterThanInclusive", "value": 100 }
    ]
  },
  "event": {
    "type": "apply-discount",
    "params": { "percent": 15 }
  }
}
```

In Neuron-JS, the same business decision becomes a script with explicit rule, condition, parameter, and action types:

```json
{
  "id": "gold-customer-discount",
  "rules": [
    {
      "id": "gold-order-over-threshold",
      "type": "simple_rule",
      "options": {},
      "conditions": [
        {
          "id": "cart-total-threshold",
          "type": "compare_two_numbers",
          "options": {},
          "params": [
            { "id": "cart-total", "name": "op1", "type": "simple_number", "value": "125", "options": {} },
            { "id": "comparison", "name": "comp", "type": "comparator", "value": ">=", "options": {} },
            { "id": "threshold", "name": "op2", "type": "simple_number", "value": "100", "options": {} }
          ]
        }
      ],
      "actions": [
        {
          "id": "discount-score",
          "type": "add_two_numbers",
          "options": {},
          "params": [
            { "id": "base-discount", "name": "op1", "type": "simple_number", "value": "10", "options": {} },
            { "id": "tier-bonus", "name": "op2", "type": "simple_number", "value": "5", "options": {} }
          ]
        }
      ]
    }
  ]
}
```

Then validate and explain it:

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} from '@sebasoft/neuron-js';

const context = { messages: [], state: { customerTier: 'gold', cartTotal: 125 } };

const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  throw new Error('Invalid migrated rule input');
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
```

## Migration checklist

- Map each fact to a parameter or context field.
- Map each operator to an approved condition type.
- Map each event to an approved action type.
- Preserve rule order, priority, and conflict behavior with tests.
- Validate every migrated script before execution.
- Snapshot explanation traces for high-value rules.
- Keep `json-rules-engine` if the existing model is already doing the job cleanly.

## Documentation

The full migration page is here:

[Neuron-JS vs json-rules-engine](https://sebasoft.github.io/neuron-js/comparisons/json-rules-engine.html)

Start with the comparison hub if you are deciding between multiple rules approaches:

[Neuron-JS comparison and migration guides](https://sebasoft.github.io/neuron-js/comparisons/)
