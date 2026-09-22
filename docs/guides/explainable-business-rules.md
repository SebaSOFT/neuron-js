# Explainable business rules: produce decision traces

A business decision is explainable when the system can return an inspectable account of what it received, which registered rule path was available or skipped, whether execution completed, and what normalized result followed. Explanation helps audits, support investigations, tests, and workflow logs; it does not replace policy review or broader application observability.

## What Neuron-JS explains

`explainExecution({ script, result })` returns a structured `ExecutionExplanation` after execution. The documented contract includes:

- the script identifier;
- an `ok` completion status;
- counts for evaluated and executed rules;
- emitted messages;
- ordered trace events for script receipt, rule availability or skip state, and execution completion or failure.

Use `summarizeExecutionOutput(result)` alongside the trace when an integration needs a small, stable result object for branching or storage.

## Execution and explanation pattern

Validate inputs before running the decision, then derive both machine-oriented output and a human-oriented trace from the same result.

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

return { output, explanation };
```

When an explanation will be persisted or returned as a machine-readable artifact, also validate it with `validateExecutionExplanation(explanation)`. Validate `output` with `validateExecutionOutput(output)` under the same conditions.

## Use explanations responsibly

A trace describes the engine’s documented execution path. It is useful evidence for questions such as:

- Which script was evaluated?
- Was a rule disabled or available?
- Did execution complete successfully?
- How many rules executed?
- Which messages were emitted?

It does not establish that a policy was fair, compliant, or correct for a person. Pair traces with versioned scripts, test cases, owner approval, and domain-specific audit records where required.

## Operational pattern

For a reviewable decision trail:

1. store a stable script identifier and version in your application;
2. validate the script and context before execution;
3. execute through the approved registry;
4. retain the normalized output plus validated explanation trace;
5. link the record to policy tests and the approval or rollback process.

For workflow agents, use the normalized output to select a deterministic next step and attach the trace for later inspection instead of asking an LLM to reconstruct why a branch was taken.

## Sources and next steps

- [Schemas, validation, and explainability](../schemas-validation-explainability.md)
- [AI-rule safety](../benchmarks/ai-rule-safety.md)
- [Core Engine: Neuron & Synapse](../concepts/core-engine.md)
- [Workflow automation integrations](../integrations/index.md)
- [Execution explanation schema](../public/schemas/explanation-trace.schema.json)
