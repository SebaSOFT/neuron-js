# Decision runtime

The decision runtime is an opt-in Neuron-JS profile for evaluating a declared decision definition against a caller-supplied JSON context snapshot. It is separate from the general `Synapse` workflow runtime.

Use it when an application needs a deterministic, reproducible decision boundary that validates inputs before execution, validates the produced outcome after execution, and returns a receipt that can be retained or replayed by the caller.

## Decision runtime vs workflow execution

`Synapse` workflow execution is intentionally flexible. An execution context has mutable `state`, and registered actions may return a changed context for later rules. That mutable workflow execution model is correct for workflow automation, routing recipes, and application-owned side effects.

The decision runtime narrows that model with an immutable context boundary:

| Concern | `Synapse` workflow execution | Decision runtime |
| --- | --- | --- |
| Context | Mutable `ExecutionContext` flowing through rules | Caller-supplied JSON snapshot copied into execution |
| Validation | Validate script and execution context before use | Validate decision definition and context schema before any component runs |
| Output | Execution result, messages, changed context, normalized summaries | Engine status, optional schema-valid outcome, diagnostics, and receipt |
| Components | Application-approved registry, including actions that may mutate workflow state | Components must be registered and declared in the decision definition manifest |
| Effects | Host application can register effectful actions | Decision-profile components are expected to be effect-free; persistence and external effects stay outside the runtime |
| Evidence | Explanation traces and normalized output are available | Every evaluation returns a receipt with hashes, runtime identity, status, diagnostics, and trace |

## Contract

A `DecisionDefinition` declares:

- a stable decision `id` and `version`;
- a JSON Schema for the caller's context snapshot;
- a JSON Schema for the caller-defined outcome;
- a component manifest listing approved rule, condition, action, and parameter types;
- the executable serializable script.

`evaluateDecision({ definition, context, neuron })` validates the definition and context, checks that every referenced component is registered and declared, executes the script against a cloned context, validates `state.outcome` against the outcome schema, and returns a `DecisionEvaluation`.

The only engine statuses are:

- `succeeded` — execution produced an outcome that satisfied the definition outcome schema;
- `invalid_context` — context validation failed before component execution;
- `no_decision` — execution completed without producing `state.outcome`;
- `execution_failed` — definition validation, manifest checks, runtime execution, or outcome validation failed.

Domain meanings belong inside the successful `outcome` object. Do not encode business, policy, routing, or approval consequences as new engine statuses.

## Side-effect boundary

The decision runtime returns data. It does not persist receipts, does not fetch context, does not call services, does not trigger workflows, does not approve changes, does not send messages, and does not mutate the caller's original context object. Consumers decide where context comes from, how outcomes are interpreted, what receipt data is retained, and which downstream system performs side effects.

This boundary lets workflow tools, services, tests, and agents ask Neuron-JS for a reproducible decision without handing the runtime responsibility for orchestration or storage.

## Receipts and replay

Every evaluation returns a `DecisionReceipt`. Receipts identify the decision, version, definition hash, context hash when the supplied context can be canonicalized, component manifest hash, runtime version, status, optional correlation metadata, diagnostics, and explanation trace.

Use receipts with retained definition and context artifacts when you need replayable evidence. Use decision test vectors when you need regression checks that detect policy behavior drift.

## Explicit non-goals

The decision runtime does not add:

- a hosted policy registry or decision-management product;
- a persistence layer, audit database, event store, or approval workflow;
- a CLI, UI, MCP server, LLM integration, HTTP service, database adapter, n8n adapter, or LangGraph adapter;
- a universal outcome vocabulary or vertical domain model;
- sandboxing guarantees for arbitrary third-party JavaScript components.

Applications still own component registration, purity review, artifact storage, side-effect orchestration, and domain interpretation.

## Runnable example

See the domain-neutral example in [`examples/generic-decision-runtime/`](../../examples/generic-decision-runtime/). It defines a context schema, outcome schema, local effect-free components, and an expected evaluation result without depending on an external service or vertical workflow.
