# AI-generated rules: validate, review, then execute

An LLM can draft a JSON business rule quickly. It cannot establish that the rule is structurally valid, permitted by the application, or correct for the intended policy. Treat generated JSON as a candidate for a controlled delivery process, not as authority to execute.

## The boundary

Neuron-JS provides three distinct controls:

1. `validateScript(script)` checks the documented structural contract before runtime.
2. `validateExecutionContext(context)` checks the execution input shape.
3. The developer-owned `Neuron` registry limits execution to approved action, condition, parameter, and rule types.

These controls prevent malformed or unapproved rule definitions from proceeding through the normal execution path. They do not prove that a valid threshold, field mapping, or approved action is the right business policy.

## Required flow

Use this sequence for generated or stored rule candidates:

1. Specify the business intent, approved inputs, allowed outcomes, and owner.
2. Generate a JSON candidate using only documented, registered types.
3. Run `validateScript` and return structured errors if it fails.
4. Build a representative `ExecutionContext` and run `validateExecutionContext`.
5. Test expected, boundary, and rejected scenarios.
6. Review the policy with the accountable owner.
7. Version the approved script and retain a rollback path.
8. Execute through `Synapse`, then record normalized output and explanation when appropriate.

Never silently repair invalid JSON and run it anyway. The caller or author needs the validation errors to correct the candidate deliberately.

## Minimal validation-first pattern

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

return {
  output: summarizeExecutionOutput(result),
  explanation: explainExecution({ script, result }),
};
```

The validation helpers report structured errors with JSONPath-like locations, making the invalid field visible to a human or another agent. Use the published schemas when another system needs the formal JSON contracts.

## Example policy-review questions

Before approving a generated rule, ask:

- Does every input field represent the intended source of truth?
- Are threshold and comparator choices correct at boundary values?
- Can the registered action create an outcome that requires a separate authorization step?
- Are expected and disallowed outcomes covered by tests?
- Who approves a change, and how is the previous script restored?

## AI workflow pattern

In n8n or LangGraph, let the LLM extract or classify structured data upstream. Validate both the script and context, execute the approved deterministic decision, and branch downstream from `summarizeExecutionOutput(result)` rather than free-form LLM text. Keep side effects in the workflow or application layer.

## Sources and next steps

- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [AI-rule safety](../benchmarks/ai-rule-safety.md)
- [AI coding assistants](../ai-coding-assistants.md)
- [LangGraph deterministic decision node](../integrations/langgraph.md)
- [n8n deterministic routing](../integrations/n8n.md)
