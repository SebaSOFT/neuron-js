# Drafting fields

Title: Neuron-JS vs node-rules: modernizing older Node.js rules systems

Alias: neuron-js-vs-node-rules

Description: A migration guide for teams maintaining node-rules systems and evaluating Neuron-JS for TypeScript-first, validated, explainable JSON business rules.

Tags: neuron-js, node-rules, typescript, rules-engine, migration, business-rules, nodejs

# Markdown body

## The short version

If an existing `node-rules` implementation works, is tested, and does not need stronger governance, keep it.

If the rule layer now needs serializable JSON assets, TypeScript-owned extension points, validation before runtime, and explanation traces, Neuron-JS is a better modernization target.

The migration question is not “which package is newer?”

The real question is: **has the rule layer become infrastructure that needs stronger contracts?**

## Why older rules systems survive

Older rules engines often stay in production because they solve a real problem: business decisions change faster than teams want to redeploy code.

That is a legitimate reason.

But older rule systems also tend to accumulate implicit behavior:

- rule functions depend on runtime object shape,
- consequence behavior is scattered,
- stop or priority behavior lives in convention,
- validation happens only after something breaks,
- explanation depends on custom logs.

Neuron-JS is designed to make those boundaries explicit.

## When to keep node-rules

Keep `node-rules` when:

- the existing implementation is stable,
- the team understands the rule lifecycle,
- behavior is covered by tests,
- migration would create risk without business value,
- there is no need for JSON schema validation or explanation traces.

A boring working system is an asset.

## When to modernize with Neuron-JS

Consider Neuron-JS when:

- rules need to be stored, versioned, reviewed, or edited as JSON,
- a TypeScript codebase needs explicit extension classes and package-root imports,
- AI-generated or admin-edited rules need validation before execution,
- support needs traceable answers for business decisions,
- frontend and backend logic need a shared deterministic contract.

This is the right migration when governance matters more than preserving an old execution style.

## Migration pattern

A typical imperative rule might look like this:

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

In Neuron-JS, convert the implicit behavior into an explicit script:

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

Then run the validation-first execution path:

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

- Inventory existing rules by business value and risk.
- Add characterization tests before translating anything.
- Move conditions into approved Neuron-JS condition types.
- Move consequences into approved Neuron-JS action types.
- Make stop and priority behavior explicit in tests.
- Validate every script before execution.
- Snapshot explanation traces for high-risk rules.

## Documentation

Full guide:

[Neuron-JS vs node-rules](https://sebasoft.github.io/neuron-js/comparisons/node-rules.html)

Comparison hub:

[Neuron-JS comparison and migration guides](https://sebasoft.github.io/neuron-js/comparisons/)
