# Drafting fields

Title: Rules engine vs if/else: when Neuron-JS is worth the machinery

Alias: rules-engine-vs-if-else

Description: A practical decision guide for keeping simple logic in TypeScript and moving only governed, dynamic business rules into Neuron-JS.

Tags: neuron-js, typescript, rules-engine, if-else, business-rules, architecture, migration

# Markdown body

## The short version

Most conditionals should stay as `if/else`.

That is not a weakness. It is good engineering.

A rules engine becomes valuable only when the logic needs to become data: stored, versioned, reviewed, validated, generated, shared, or explained.

Neuron-JS is for that second category.

Use `if/else` when the condition is simple, local, and stable.

Use Neuron-JS when the condition is really business policy and the system needs a safe JSON representation with validation and explanation.

## The wrong reason to use a rules engine

Do not use a rules engine because it feels more architectural.

This is clearer:

```typescript
if (customerTier === 'gold' && cartTotal >= 100) {
  return 15;
}

return 0;
```

If that condition rarely changes and only belongs in one code path, keep it there.

A rules engine adds value only when the operational problem changes.

## The right reason to use Neuron-JS

Move to Neuron-JS when the rule needs a lifecycle outside a normal code deployment.

Examples:

- pricing rules are reviewed by non-developer stakeholders,
- eligibility rules are stored in a database,
- workflow routing rules are shared between backend and frontend,
- AI agents generate candidate rules that need validation,
- support needs to explain why a decision happened,
- audit trails need a deterministic execution trace.

At that point, the rule is no longer just code. It is a product asset.

## What Neuron-JS adds

Neuron-JS gives the rule a formal contract:

- JSON script format,
- approved TypeScript registry vocabulary,
- schema validation before runtime,
- deterministic execution through `Synapse`,
- normalized output,
- explanation traces.

That is machinery. Use it only when the machinery pays for itself.

## Migration pattern

Start with the plain code:

```typescript
function calculateDiscount(customerTier: string, cartTotal: number) {
  if (customerTier === 'gold' && cartTotal >= 100) {
    return 15;
  }

  return 0;
}
```

If the rule needs governance, convert the business decision into a Neuron-JS script:

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

Then validate, execute, summarize, and explain:

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

## Decision checklist

Keep `if/else` when:

- the logic is simple,
- the logic is local,
- the logic rarely changes,
- the code is easier to read directly,
- there is no need to store or explain it as data.

Use Neuron-JS when:

- the rule changes independently from deployments,
- the rule needs review or approval,
- the rule must be stored as JSON,
- generated rules need validation,
- decisions need explanation traces,
- multiple runtimes need the same deterministic rule contract.

## Documentation

Full guide:

[Rules engine vs if/else](https://sebasoft.github.io/neuron-js/comparisons/if-else.html)

Comparison hub:

[Neuron-JS comparison and migration guides](https://sebasoft.github.io/neuron-js/comparisons/)
