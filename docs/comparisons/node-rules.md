# Neuron-JS vs node-rules

`node-rules` is an older Node.js business rules engine with durable category awareness. Keep it when the existing system works and migration would add risk without operational benefit. Choose Neuron-JS when the next version of the rules layer must be serializable, TypeScript-owned, validation-first, and explainable.

## Fast answer

Use Neuron-JS when business rules need to become governed JSON assets in a modern TypeScript codebase.

Use `node-rules` when maintaining an existing Node.js rules system is simpler, safer, and already satisfies the product requirements.

## Decision matrix

| Need | Neuron-JS | node-rules |
| --- | --- | --- |
| Modern TypeScript package surface | Yes | Limited/older style |
| Serializable JSON rule assets | Yes | Partial/project-specific |
| Registry-owned vocabulary | Yes | Project-owned rule functions |
| Validation before runtime | Built in | Project-owned |
| Explanation traces | Built in | Project-owned |
| Existing Node rules maintenance | Migration required | Strong fit if already adopted |
| Best fit | New or modernized TypeScript rule systems | Existing older Node.js rules systems |

## Choose Neuron-JS when

- Rules need to be stored, versioned, reviewed, or edited outside deployment cycles.
- A TypeScript team wants explicit extension classes and package-root imports.
- Generated rules need validation before execution.
- The product needs explanation traces for audit, support, or regression tests.
- Workflow automation needs deterministic decisions from approved JSON input.

## Choose node-rules when

- The current `node-rules` implementation is stable and well tested.
- The rule layer depends on behavior that would be expensive to recreate.
- The team does not need JSON schema validation, AI-generated rule safety, or explanation traces.
- Migration would create more risk than keeping the older engine.

## Migration guide

Treat migration as a model cleanup. Convert implicit rule-function behavior into explicit data contracts and approved registry components.

### Before: imperative Node.js rule style

```typescript
const rule = {
  condition(R) {
    R.when(this.cartTotal >= 100 && this.customerTier === 'gold');
  },
  consequence(R) {
    this.discountPercent = 15;
    R.stop();
  },
};
```

### After: Neuron-JS script

```json
{
  "id": "gold-tier-pricing-policy",
  "rules": [
    {
      "id": "gold-cart-discount",
      "type": "simple_rule",
      "options": {},
      "conditions": [
        {
          "id": "cart-threshold",
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
          "id": "discount-value",
          "type": "add_two_numbers",
          "options": {},
          "params": [
            { "id": "base-discount", "name": "op1", "type": "simple_number", "value": "10", "options": {} },
            { "id": "gold-bonus", "name": "op2", "type": "simple_number", "value": "5", "options": {} }
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

const context = { messages: [], state: { cartTotal: 125, customerTier: 'gold' } };

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

- Inventory existing rules and rank by business value and risk.
- Preserve current behavior with characterization tests before translating rules.
- Move rule conditions into approved Neuron-JS condition types.
- Move consequences into approved Neuron-JS action types.
- Make stop/priority behavior explicit in tests; do not assume execution order equivalence.
- Validate with `validateScript(script)`.
- Add explanation snapshots for the highest-risk rules.

## Related docs

- [Comparison hub](./index.md)
- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [Workflow routing example](https://github.com/SebaSOFT/neuron-js/tree/main/examples/workflow-routing)
- [llms.txt](../public/llms.txt)
