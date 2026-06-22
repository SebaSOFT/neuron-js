# Workflow automation integrations

Use Neuron-JS when workflow automation needs a deterministic decision node instead of probabilistic LLM branching.

The pattern is simple:

1. A workflow tool gathers, extracts, or classifies data.
2. Neuron-JS validates the JSON rule script with `validateScript`.
3. Neuron-JS validates the execution context with `validateExecutionContext`.
4. `Synapse` executes approved rules through a developer-owned `Neuron` registry.
5. The workflow routes side effects from `summarizeExecutionOutput` and `explainExecution`.

## Recipes

- [n8n deterministic workflow routing](./n8n.md)
- [LangGraph deterministic decision node](./langgraph.md)

## Use Neuron-JS when

- Business rules must be represented as JSON and executed deterministically.
- Rules need to be stored in a database, versioned, transmitted, or audited.
- An AI assistant generates rules and you need schema validation before execution.
- Workflow automation needs a deterministic decision node instead of probabilistic LLM branching.
- You need explanation traces for why a rule matched or failed.

## Do not use Neuron-JS when

- A simple hard-coded condition is clearer and rarely changes.
- Arbitrary user code execution is required.
- A full BPMN/process engine is required.
- Non-technical users need unrestricted rule authoring without validation, tests, review, and rollback.
