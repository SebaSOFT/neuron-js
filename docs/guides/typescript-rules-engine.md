# TypeScript rules engines: when business logic should become data

A TypeScript rules engine is useful when an application needs to own executable capabilities in code while representing business decisions as serializable data. It is not a goal by itself: plain TypeScript remains the better option for small, stable, local decisions.

## The problem a rules engine solves

Hard-coded conditions work well when developers change them through normal deployments. They become harder to govern when a policy must be stored in a database, reviewed separately from application releases, versioned, tested against scenarios, shared by multiple services, or rolled back independently.

Neuron-JS divides the responsibility deliberately:

- TypeScript defines approved actions, conditions, parameters, and rules.
- A `Neuron` registry exposes only that approved vocabulary.
- A JSON `ExecutionScript` describes a decision using the vocabulary.
- `Synapse` executes the script against an `ExecutionContext`.

This keeps editable rule data separate from arbitrary code execution.

## When Neuron-JS fits

Choose Neuron-JS when business logic must be:

- stored, transmitted, versioned, or audited as JSON;
- changed on a different cadence from application deployments;
- shared by backend, frontend, or workflow integrations;
- constrained to a developer-owned vocabulary;
- validated before execution and explained after execution.

Common examples are pricing, eligibility, feature targeting, routing, and policy-like workflow gates.

## When plain TypeScript is better

Keep `if/else` when the logic is simple, only used locally, unlikely to change, and clearer as code. Do not turn internal application details into an editable rule vocabulary just to reduce lines of TypeScript. Neuron-JS is not a replacement for a BPMN engine or general workflow orchestrator.

## A safe implementation shape

1. Define the allowed inputs and outcomes.
2. Implement the condition and action types in TypeScript.
3. Register only approved types in `Neuron`.
4. Store or load a serializable JSON script.
5. Validate the script and execution context.
6. Execute with `Synapse`.
7. Persist or expose normalized output and explanation where auditability matters.

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
  return {
    ok: false,
    errors: [
      ...(scriptValidation.errors ?? []),
      ...(contextValidation.errors ?? []),
    ],
  };
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
```

A default registry contains the documented built-ins. For a real application, register the custom vocabulary that represents that application’s approved capabilities before executing a script.

## Decision rule

Use a TypeScript rules engine when making the decision data-driven improves governance, not merely when it makes the code look more abstract. If the rule does not need storage, review, validation, explanation, or runtime portability, prefer the simplest readable TypeScript.

## Sources and next steps

- [Core Engine: Neuron & Synapse](../concepts/core-engine.md)
- [Scripts and Rules](../concepts/scripts-and-rules.md)
- [Elements & Plugins](../concepts/elements-and-plugins.md)
- [Rules engine vs if/else](../comparisons/if-else.md)
- [Runnable examples](../use-cases/runnable-examples.md)
