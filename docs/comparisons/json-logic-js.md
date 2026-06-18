# Neuron-JS vs JsonLogic / json-logic-js

JsonLogic is a compact, portable JSON predicate format. It is a strong fit when a decision is mostly a boolean expression and cross-language portability matters. Neuron-JS fits when that predicate grows into a TypeScript-owned business decision with named vocabulary, validation, execution output, and explanation traces.

## Fast answer

Use Neuron-JS when the rule is part of an application workflow: validate the JSON, execute a deterministic decision, run approved actions, and explain what happened.

Use JsonLogic when you need a compact, language-portable predicate and the output is primarily true or false.

## Decision matrix

| Need | Neuron-JS | JsonLogic / json-logic-js |
| --- | --- | --- |
| JSON representation | Yes | Yes |
| Predicate-only decisions | Possible | Strong fit |
| Cross-language portability | JavaScript/TypeScript package focus | Strong ecosystem fit |
| Named registry components | Yes | Custom operators/project-owned |
| Actions after conditions | Yes | Not the core model |
| Schema validation before runtime | Built in | Project-owned |
| Explanation traces | Built in | Project-owned |
| Best fit | Validated business workflows and decisions | Portable boolean logic |

## Choose Neuron-JS when

- The decision needs conditions and approved actions, not only a boolean predicate.
- TypeScript code owns the rule vocabulary and extension points.
- AI-generated rules need schema validation before execution.
- Support, audit, or tests need explanation traces.
- The rule is stored, versioned, reviewed, or changed through a governance process.

## Choose JsonLogic when

- The rule is a compact boolean expression.
- Cross-language compatibility is more important than TypeScript registry ergonomics.
- You already have JsonLogic rules and custom operators that are stable.
- The decision does not need Neuron-JS actions, lifecycle hooks, or explanation contracts.

## Migration guide

Migrate when a predicate has become product logic that needs ownership, validation, and explainability.

### Before: JsonLogic predicate

```json
{
  "and": [
    { ">=": [{ "var": "cart.total" }, 100] },
    { "==": [{ "var": "customer.tier" }, "gold"] }
  ]
}
```

### After: Neuron-JS decision script

```json
{
  "id": "gold-cart-eligibility",
  "rules": [
    {
      "id": "cart-over-threshold",
      "type": "simple_rule",
      "options": {},
      "conditions": [
        {
          "id": "cart-total-check",
          "type": "compare_two_numbers",
          "options": {},
          "params": [
            { "id": "cart-total", "name": "op1", "type": "simple_number", "value": "125", "options": {} },
            { "id": "operator", "name": "comp", "type": "comparator", "value": ">=", "options": {} },
            { "id": "minimum", "name": "op2", "type": "simple_number", "value": "100", "options": {} }
          ]
        }
      ],
      "actions": [
        {
          "id": "eligibility-score",
          "type": "add_two_numbers",
          "options": {},
          "params": [
            { "id": "base-score", "name": "op1", "type": "simple_number", "value": "1", "options": {} },
            { "id": "tier-score", "name": "op2", "type": "simple_number", "value": "1", "options": {} }
          ]
        }
      ]
    }
  ]
}
```

### Validate and explain the migrated rule

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} from '@sebasoft/neuron-js';

const context = {
  messages: [],
  state: { cart: { total: 125 }, customer: { tier: 'gold' } },
};

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

- Separate boolean predicates from actions and side effects.
- Replace anonymous operator trees with named conditions and actions.
- Preserve edge cases for missing values, nulls, strings, and number coercion.
- Add tests that compare JsonLogic results to Neuron-JS outputs during the migration window.
- Validate with `validateScript(script)` before execution.
- Use `explainExecution({ script, result })` to document rule behavior for reviewers.

## Related docs

- [Comparison hub](./index.md)
- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [Eligibility check example](https://github.com/SebaSOFT/neuron-js/tree/main/examples/eligibility-check)
- [llms.txt](../public/llms.txt)
