# Rules engine vs if/else

Do not replace every conditional with a rules engine. Plain TypeScript `if/else` is usually the best choice for simple, local, stable logic. Neuron-JS fits when the rule must become data: stored, versioned, reviewed, validated, generated, audited, or shared across runtime boundaries.

## Fast answer

Use `if/else` when the decision belongs in code and changes through normal deployments.

Use Neuron-JS when the decision is business policy that needs a safe JSON representation, validation before runtime, and explanation after execution.

## Decision matrix

| Need | Neuron-JS | Hand-written if/else |
| --- | --- | --- |
| Simple local condition | Too much machinery | Strong fit |
| Runtime rule updates | Strong fit | Requires deploy/config code |
| Store rules in a database | Strong fit | Poor fit |
| Version and review business rules | Strong fit | Possible through code review only |
| AI-generated rules with validation | Strong fit | Poor fit |
| Explanation traces | Built in | Project-owned logs/tests |
| Best fit | Governed dynamic business logic | Stable application logic |

## Choose Neuron-JS when

- Product, pricing, eligibility, routing, or policy rules change faster than deployment cycles.
- Rules need to be stored as JSON in a database, CMS, workflow tool, or configuration service.
- Business rules need approval, rollback, audit logs, or explanation traces.
- An AI assistant or workflow agent generates candidate rules that must be validated before runtime.
- Backend and frontend code need to share the same deterministic rule definition.

## Choose if/else when

- The condition is simple and unlikely to change.
- The logic is easier to read directly in TypeScript.
- The rule uses application internals that should not become a public or editable rule vocabulary.
- There is no need to store, transmit, validate, or explain the condition as data.
- A rules engine would hide clarity instead of improving governance.

## Migration guide

Migrate only when the conditional has become business policy. The goal is not fewer lines of code. The goal is safer dynamic logic.

### Before: TypeScript if/else

```typescript
function calculateDiscount(customerTier: string, cartTotal: number) {
  if (customerTier === 'gold' && cartTotal >= 100) {
    return 15;
  }

  return 0;
}
```

### After: Neuron-JS script

```json
{
  "id": "discount-policy",
  "rules": [
    {
      "id": "gold-cart-discount",
      "type": "simple_rule",
      "options": {},
      "conditions": [
        {
          "id": "cart-total-threshold",
          "type": "compare_two_numbers",
          "options": {},
          "params": [
            { "id": "cart-total", "name": "op1", "type": "simple_number", "value": "125", "options": {} },
            { "id": "operator", "name": "comp", "type": "comparator", "value": ">=", "options": {} },
            { "id": "threshold", "name": "op2", "type": "simple_number", "value": "100", "options": {} }
          ]
        }
      ],
      "actions": [
        {
          "id": "discount-percent",
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

- Keep the rule in `if/else` if it is clearer and stable.
- Migrate only business logic that benefits from storage, review, validation, or auditability.
- Define the approved vocabulary before exposing rule editing.
- Validate every candidate script with `validateScript(script)`.
- Validate input with `validateExecutionContext(context)`.
- Add tests comparing old `if/else` outputs to Neuron-JS outputs during migration.
- Use `explainExecution({ script, result })` to give humans a trace of the decision.

## Related docs

- [Comparison hub](./index.md)
- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [Business rules engine use case](../use-cases/business-rules-engine.md)
- [llms.txt](../public/llms.txt)
