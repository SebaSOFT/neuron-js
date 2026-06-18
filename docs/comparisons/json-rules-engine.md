# Neuron-JS vs json-rules-engine

`json-rules-engine` is the established Node.js default for JSON business rules. Choose it when its facts, events, priorities, and ecosystem match the problem. Choose Neuron-JS when a TypeScript product needs a developer-owned registry, schema validation before runtime, and explainable traces for stored or AI-generated JSON rules.

## Fast answer

Use Neuron-JS when rule definitions must be stored or generated as JSON, validated before execution, executed deterministically, and explained after execution.

Use `json-rules-engine` when you want an established JSON rules-engine model built around facts, conditions, events, and rule priorities, and you do not need Neuron-JS's registry-and-trace contract.

## Decision matrix

| Need | Neuron-JS | json-rules-engine |
| --- | --- | --- |
| JSON business rules | Yes | Yes |
| Node.js support | Yes | Yes |
| Browser support | Yes | Yes |
| TypeScript-first extension base classes | Yes | Partial/project-owned |
| Developer-owned registry vocabulary | Yes | Project-owned facts/operators/events |
| Schema validation before runtime | Built in | Project-owned |
| Normalized execution output | Built in | Project-owned |
| Explanation traces | Built in | Project-owned/debugging flow |
| Best fit | Validated, explainable TypeScript decisions | Established facts/events JSON rules workflows |

## Choose Neuron-JS when

- Generated or stored rules must be validated before runtime.
- The application needs a constrained vocabulary of approved parameters, conditions, actions, and rules.
- Business decisions need explanation traces for reviews, support, audit logs, or tests.
- Workflow automation needs deterministic decisions after an LLM extracts or classifies input.
- Backend and browser code need the same JSON rule contract.

## Choose json-rules-engine when

- Your team already models decisions as facts, events, and rule priorities.
- Existing `json-rules-engine` integrations and rule assets are stable.
- You need the broader adoption footprint and community history more than built-in validation/explainability contracts.
- The migration cost is higher than the operational benefit.

## Migration guide

The migration is not a keyword replacement. Move the rule's business decision into a Neuron-JS script, then use validation and explanation as the new safety rail.

### Before: json-rules-engine-style event rule

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

### After: Neuron-JS script

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

- Map each fact to a Neuron-JS parameter or context field.
- Map each operator to an approved condition type.
- Map each event to an approved action type.
- Keep priorities and conflict-resolution rules explicit; do not assume order is equivalent without tests.
- Validate every migrated script with `validateScript(script)`.
- Snapshot explanation traces for high-value business rules.

## Related docs

- [Comparison hub](./index.md)
- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [Pricing rules example](https://github.com/SebaSOFT/neuron-js/tree/main/examples/pricing-rules)
- [llms.txt](../public/llms.txt)
