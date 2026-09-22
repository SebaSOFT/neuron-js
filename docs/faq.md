# Neuron-JS FAQ

This FAQ answers common questions about using Neuron-JS for TypeScript business rules, AI-assisted rule authoring, and explainable decisions. It is intentionally bounded by the documented public API, schemas, runnable examples, and integration recipes.

## What is Neuron-JS?

Neuron-JS is an AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions. A developer-owned `Neuron` registry defines approved capabilities; `Synapse` evaluates a JSON script against an execution context.

See [Core Engine](./concepts/core-engine.md) and [Scripts and Rules](./concepts/scripts-and-rules.md).

## Is Neuron-JS a good replacement for every `if/else` statement?

No. Keep plain TypeScript when a decision is local, stable, and clearer in code. Use Neuron-JS when the decision must be stored, versioned, reviewed, validated, audited, shared across runtimes, or changed independently of an application deployment.

See [Rules engine vs if/else](./comparisons/if-else.md).

## What does “TypeScript rules engine” mean here?

TypeScript owns the executable vocabulary: applications implement and register approved actions, conditions, parameters, and rules. JSON then describes a decision using only those approved types. This separates application capabilities from editable business logic without treating JSON as arbitrary executable code.

See [TypeScript rules engines](./guides/typescript-rules-engine.md) and [Elements & Plugins](./concepts/elements-and-plugins.md).

## Can an LLM generate Neuron-JS rules safely?

An LLM can draft a candidate JSON rule, but a draft is not production-ready by itself. Validate the script with `validateScript`, validate the context with `validateExecutionContext`, test and review the candidate, and execute only through an approved registry. Return structured validation errors and stop when validation fails; do not silently repair or run invalid rules.

See [AI-generated validated rules](./guides/ai-generated-validated-rules.md), [AI-rule safety](./benchmarks/ai-rule-safety.md), and [AI coding assistants](./ai-coding-assistants.md).

## Does validation prove that a rule expresses the right policy?

No. Validation verifies the documented structural contract, such as required fields and input shape. It does not prove that an approved threshold, field choice, or action matches the intended business policy. Test candidate rules against known cases and require an accountable owner to review policy changes before production use.

See [Schemas, validation, and explainability](./schemas-validation-explainability.md).

## How does Neuron-JS prevent arbitrary code execution?

The JSON script identifies registered types; it does not carry arbitrary executable code. The application controls what is registered in its `Neuron` registry. Do not expose unrestricted rule authoring where the approved vocabulary, validation, testing, review, rollback, and explanations are absent.

See [AI-generated validated rules](./guides/ai-generated-validated-rules.md) and [Workflow automation integrations](./integrations/index.md).

## What makes a business rule explainable?

After execution, `explainExecution({ script, result })` returns a structured trace describing the received script, available or skipped rules, and completion or failure status. Combine it with `summarizeExecutionOutput(result)` for a stable result object. Explanation is an audit aid, not a substitute for policy review or application logging.

See [Explainable business rules](./guides/explainable-business-rules.md).

## Can I use Neuron-JS in AI-agent or workflow systems?

Yes. Use it after an LLM or upstream workflow step extracts or classifies structured data. Validate the script and context, execute the approved decision, then route the next step from normalized deterministic output rather than free-form LLM text. Keep external side effects in the workflow tool or application layer.

See the [n8n](./integrations/n8n.md) and [LangGraph](./integrations/langgraph.md) recipes.

## Does Neuron-JS replace BPMN or a long-running workflow engine?

No. Neuron-JS evaluates deterministic decisions. It is not a full BPMN/process orchestration platform or a general long-running side-effect engine. Use an orchestration tool when you need scheduling, compensation, human-task management, or durable multi-step workflow state.

See [Workflow automation integrations](./integrations/index.md).

## Where can I start with working code?

Run the first-party examples from a checkout:

```bash
yarn examples
```

The command builds the package and verifies pricing, eligibility, workflow-routing, n8n, and LangGraph example contracts. See [Runnable examples](./use-cases/runnable-examples.md).

## Sources

- [Core Engine](./concepts/core-engine.md)
- [Schemas, Validation & Explainability](./schemas-validation-explainability.md)
- [AI-rule safety](./benchmarks/ai-rule-safety.md)
- [Runnable examples](./use-cases/runnable-examples.md)
- [n8n and LangGraph integration recipes](./integrations/index.md)
