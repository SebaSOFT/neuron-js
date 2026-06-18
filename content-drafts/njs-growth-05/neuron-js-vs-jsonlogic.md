# Drafting fields

Title: Neuron-JS vs JsonLogic: predicate format or TypeScript rules engine?

Alias: neuron-js-vs-jsonlogic

Description: A practical guide for deciding between JsonLogic and Neuron-JS when JSON predicates grow into validated, explainable TypeScript business decisions.

Tags: neuron-js, jsonlogic, json-logic-js, typescript, rules-engine, migration, ai-agents

# Markdown body

## The short version

JsonLogic is excellent when the problem is a portable JSON predicate.

Neuron-JS is a better fit when that predicate has grown into a business decision that needs an owned TypeScript vocabulary, validation before runtime, approved actions, and explanation after execution.

The clean rule is this:

- Use JsonLogic for compact boolean logic.
- Use Neuron-JS for governed JSON business decisions.

Both are useful. They solve different pressure points.

## JsonLogic is not the enemy

JsonLogic earned its place because it is small and portable. A rule like this is easy to store, transmit, and evaluate:

```json
{
  "and": [
    { ">=": [{ "var": "cart.total" }, 100] },
    { "==": [{ "var": "customer.tier" }, "gold"] }
  ]
}
```

That is a strong shape when the output is mostly true or false.

It becomes weaker when the system needs named rule components, approved actions, review workflows, generated rule validation, or explanation traces.

That is where Neuron-JS belongs.

## Where Neuron-JS changes the model

Neuron-JS does not only ask “is this predicate true?”

It asks:

- Is this script structurally valid?
- Are the condition and action types approved by the application?
- Can the runtime execute it deterministically?
- Can the result be summarized?
- Can a human review why it happened?

That is the difference between a predicate format and a rules engine contract.

## When to stay with JsonLogic

Stay with JsonLogic when:

- the rule is a compact boolean expression,
- cross-language portability is the main requirement,
- the team already has stable JsonLogic rules and operators,
- the decision does not need approved actions,
- validation and explanation can remain project-owned.

Do not migrate a clean predicate just to use a larger abstraction.

## When to move to Neuron-JS

Move to Neuron-JS when the rule becomes product logic.

Good triggers:

- business rules are edited or reviewed outside normal deployments,
- AI agents generate rules and malformed JSON must be rejected safely,
- the rule needs conditions and actions, not only true or false,
- support or audit teams need explanation traces,
- frontend and backend code need the same TypeScript-owned rule vocabulary.

## Migration pattern

Start by separating the predicate from the business action.

JsonLogic predicate:

```json
{
  "and": [
    { ">=": [{ "var": "cart.total" }, 100] },
    { "==": [{ "var": "customer.tier" }, "gold"] }
  ]
}
```

Neuron-JS script:

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

Validation and execution:

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

- Keep pure predicates in JsonLogic when portability is the point.
- Move only governed business decisions into Neuron-JS.
- Replace anonymous operator trees with named conditions and actions.
- Preserve null, missing value, string, and number coercion behavior in tests.
- Validate scripts before runtime.
- Use explanation traces for reviewer confidence.

## Documentation

Full guide:

[Neuron-JS vs JsonLogic / json-logic-js](https://sebasoft.github.io/neuron-js/comparisons/json-logic-js.html)

Comparison hub:

[Neuron-JS comparison and migration guides](https://sebasoft.github.io/neuron-js/comparisons/)
