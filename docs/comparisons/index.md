# Comparison and migration guides

Use these guides to decide when Neuron-JS is the right TypeScript rules engine, when another rules library is a better fit, and how to migrate safely when JSON rules need validation, explainability, and deterministic execution.

Neuron-JS should not be chosen by default for every conditional. It fits when business logic must become data: stored, versioned, reviewed, generated, validated, executed, and explained.

## Fast decision tree

- Use plain `if/else` when a condition is simple, local, and rarely changes.
- Use JsonLogic when you need compact, portable boolean predicates across languages.
- Use `json-rules-engine` when you want the established Node.js JSON rules-engine default with facts, events, and priority semantics.
- Use `node-rules` when maintaining an older Node.js rules-engine implementation is cheaper than migration.
- Use Neuron-JS when a TypeScript system needs serializable JSON business rules, developer-owned registry vocabulary, validation before runtime, and explainable execution traces.

## Guides

- [Neuron-JS vs json-rules-engine](./json-rules-engine.md)
- [Neuron-JS vs JsonLogic / json-logic-js](./json-logic-js.md)
- [Neuron-JS vs node-rules](./node-rules.md)
- [Rules engine vs if/else](./if-else.md)

## Comparison matrix

| Need | Neuron-JS | json-rules-engine | JsonLogic | node-rules | if/else |
| --- | --- | --- | --- | --- | --- |
| Serializable rules | Yes | Yes | Yes | Partial | No |
| TypeScript-first extension points | Yes | Partial | No | No | Native code |
| Schema validation before runtime | Yes | Project-owned | Project-owned | Project-owned | Type checker only |
| Explanation traces | Yes | Project-owned | Project-owned | Project-owned | Logs/tests only |
| AI-generated rule safety | Strong fit | Possible with custom guardrails | Possible for predicates | Weak fit | Poor fit |
| Best use | Auditable JSON business rules and workflow decisions | Established JSON rules-engine workflows | Portable predicates | Existing older rules systems | Simple stable conditions |

## Migration baseline

Every migration should keep this validation-before-execution contract:

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} from '@sebasoft/neuron-js';

const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  throw new Error('Invalid Neuron-JS input');
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
```

## Migration checklist

- Identify the business decision, not only the existing code shape.
- List the approved parameters, conditions, actions, and rules.
- Convert the rule into serializable JSON.
- Validate with `validateScript(script)`.
- Validate runtime input with `validateExecutionContext(context)`.
- Execute through `Synapse` with the application registry.
- Normalize output with `summarizeExecutionOutput(result)`.
- Explain the run with `explainExecution({ script, result })`.
- Add tests or snapshots for edge cases and approval workflows.

## Related docs

- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [Runnable examples](../use-cases/runnable-examples.md)
- [AI coding assistants](../ai-coding-assistants.md)
- [llms.txt](../public/llms.txt)
