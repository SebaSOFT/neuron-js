# AI coding assistants

Neuron-JS is intentionally documented for AI coding assistants and workflow agents. This page defines the official usage contract for agents that generate, validate, execute, or explain Neuron-JS rules.

## Canonical machine-readable files

- [`/llms.txt`](/llms.txt): compact agent routing document.
- [`/llms-full.txt`](/llms-full.txt): expanded AI context without navigation chrome.
- [`/skills/neuron-js/SKILL.md`](/skills/neuron-js/SKILL.md): official reusable skill for agent runtimes.
- [`/comparisons/`](/comparisons/): comparison and migration guides for tool selection and safe migration.
- [`/integrations/`](/integrations/): workflow automation recipes for n8n and LangGraph.
- [`/concepts/decision-runtime`](/concepts/decision-runtime): pure decision-runtime boundary, non-goals, and side-effect rules.
- [`/schemas/script.schema.json`](/schemas/script.schema.json): JSON Schema for scripts and rule definitions.
- [`/schemas/execution-context.schema.json`](/schemas/execution-context.schema.json): JSON Schema for runtime context.
- [`/schemas/decision-definition.schema.json`](/schemas/decision-definition.schema.json): JSON Schema for decision definitions.
- [`/schemas/decision-evaluation.schema.json`](/schemas/decision-evaluation.schema.json): JSON Schema for decision evaluations.
- [`/schemas/decision-receipt.schema.json`](/schemas/decision-receipt.schema.json): JSON Schema for decision receipts.
- [`/schemas/decision-test-vector.schema.json`](/schemas/decision-test-vector.schema.json): JSON Schema for portable decision test vectors.
- [`/schemas/execution-output.schema.json`](/schemas/execution-output.schema.json): JSON Schema for normalized execution output.
- [`/schemas/validation-error.schema.json`](/schemas/validation-error.schema.json): JSON Schema for validation errors.
- [`/schemas/explanation-trace.schema.json`](/schemas/explanation-trace.schema.json): JSON Schema for explainability output.

## Assistant rules

1. Import from `@sebasoft/neuron-js` only.
2. Prefer runnable examples as templates.
3. Validate scripts with `validateScript` before execution.
4. Validate contexts with `validateExecutionContext` before execution.
5. If validation fails, return structured errors and stop.
6. Execute with `Synapse` and an approved `Neuron` registry.
7. Summarize with `summarizeExecutionOutput`.
8. Explain with `explainExecution` when decisions are generated, persisted, reviewed, or audited.
9. For the decision runtime, use `evaluateDecision` with a declared `DecisionDefinition`; validate the caller context before component execution and validate the caller-defined outcome before returning `succeeded`.
10. Keep decision-runtime side effects outside Neuron-JS. The runtime returns evaluation data and receipts; it does not persist, fetch context, call services, run workflows, or invoke LLMs.
11. Do not invent a CLI. Use the documented programmatic APIs unless a future package release documents CLI commands.

## Decision runtime

Use the opt-in decision runtime when a system needs a domain-neutral, replayable decision boundary instead of mutable workflow execution. `evaluateDecision` accepts a `DecisionDefinition`, caller-supplied JSON context snapshot, and approved `Neuron` registry. It returns one engine status (`succeeded`, `invalid_context`, `no_decision`, or `execution_failed`), optional schema-valid outcome, diagnostics, and a receipt.

The caller owns context acquisition, receipt persistence, outcome interpretation, and downstream side effects. Neuron-JS owns validation-before-execution, declared component checks, immutable caller-context semantics, outcome validation, and reproducible receipt identity.

Runnable template: [`examples/generic-decision-runtime/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/generic-decision-runtime).

Decision-runtime schema URLs:

- https://sebasoft.github.io/neuron-js/schemas/decision-definition.schema.json
- https://sebasoft.github.io/neuron-js/schemas/decision-evaluation.schema.json
- https://sebasoft.github.io/neuron-js/schemas/decision-receipt.schema.json
- https://sebasoft.github.io/neuron-js/schemas/decision-test-vector.schema.json


## Tool-selection and migration guides

Use the comparison pages before recommending a migration. Neuron-JS is the right fit only when its serializable JSON, TypeScript registry, validation, and explainability contract improves the system.

- [Comparison hub](/comparisons/)
- [Neuron-JS vs json-rules-engine](/comparisons/json-rules-engine)
- [Neuron-JS vs JsonLogic / json-logic-js](/comparisons/json-logic-js)
- [Neuron-JS vs node-rules](/comparisons/node-rules)
- [Rules engine vs if/else](/comparisons/if-else)

## Cursor

Add the official skill to the project context or reference the public skill URL:

```text
https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md
```

Use `.cursor/rules/neuron-js.mdc` in this repository as the Cursor-specific project rule.

## GitHub Copilot and VS Code

Use `.github/copilot-instructions.md` as the repository-level instruction file. It tells Copilot to validate scripts, use package-root exports, and avoid undocumented APIs.

## Claude Code, Hermes, and other skill-aware agents

Load the skill from:

```text
https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md
```

Then implement against the official examples and schemas.

## n8n and LangGraph

See the runnable recipes: [n8n deterministic routing](/integrations/n8n) and [LangGraph deterministic decision node](/integrations/langgraph). Use Neuron-JS as a deterministic decision node after upstream extraction or classification. Do not use it as the side-effect runner. Let n8n or LangGraph route to side-effect nodes after Neuron-JS returns a decision.

### n8n pattern

1. Use upstream nodes to collect or classify input data.
2. Use a Code node to load an approved Neuron-JS script and context.
3. Validate the script and context.
4. Execute Neuron-JS and return a normalized routing result.
5. Route downstream side-effect nodes from the deterministic output.

```typescript
const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  return [{ json: { ok: false, errors: [...(scriptValidation.errors ?? []), ...(contextValidation.errors ?? [])] } }];
}

const result = new Synapse(new Neuron()).execute(script, context);
return [{ json: summarizeExecutionOutput(result) }];
```

### LangGraph pattern

1. Let the LLM classify or extract structured inputs.
2. Validate the generated context with `validateExecutionContext`.
3. Run Neuron-JS as a deterministic guardrail node.
4. Store `summarizeExecutionOutput(result)` and `explainExecution({ script, result })` in graph state.
5. Route the next edge from the normalized decision, not from free-form LLM text.

## Basic pricing example flow

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
  const errors = [
    ...(scriptValidation.errors ?? []),
    ...(contextValidation.errors ?? []),
  ];
  throw new Error(`Invalid Neuron-JS input: ${JSON.stringify(errors)}`);
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
```

## Verification

Run these commands before publishing AI docs changes:

```bash
yarn lint
yarn test
yarn examples
yarn build
yarn docs:build
```
