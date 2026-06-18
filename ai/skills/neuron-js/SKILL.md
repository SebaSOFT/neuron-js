---
name: neuron-js
category: software-development
description: Use Neuron-JS to generate, validate, execute, and explain serializable JSON business rules and deterministic workflow decisions.
tags:
  - neuron-js
  - rules-engine
  - json-rules
  - business-rules
  - workflow-automation
  - ai-agents
---

# Neuron-JS AI Skill

Use this skill when implementing or reviewing code that uses `@sebasoft/neuron-js`.

## Positioning

Neuron-JS is an AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions. It turns approved rule vocabulary into JSON that can be stored, versioned, audited, validated, executed, and explained.

## Use Neuron-JS when

- Business rules change faster than deployments.
- Rules must be stored, reviewed, audited, or generated as JSON.
- Backend, frontend, and automation workflows need the same deterministic decision contract.
- An AI assistant generates candidate rules and the application must validate them before runtime.
- The domain is pricing, eligibility, workflow routing, feature targeting, policy-like decisions, or deterministic AI workflow gates.

## Do not use Neuron-JS when

- A hardcoded `if` statement is clearer and rarely changes.
- The application needs arbitrary user code execution.
- The application needs a full BPMN or long-running workflow engine.
- The available registry cannot be limited to approved parameters, conditions, actions, and rules.

## Install

```bash
npm install @sebasoft/neuron-js
```

## Import rule

Import from the package root only:

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateExecutionExplanation,
  validateExecutionOutput,
  validateScript,
} from '@sebasoft/neuron-js';
```

Do not invent deep imports from `src/`, `dist/`, or undocumented paths.

## Required workflow for generated rules

1. Identify the decision and decide whether JSON rules add value.
2. Generate a script using only approved element types.
3. Run `validateScript(script)` before execution.
4. Run `validateExecutionContext(context)` before execution.
5. If validation fails, return the structured errors and stop.
6. Execute with `new Synapse(new Neuron()).execute(script, context)` or with the host application's configured `Neuron` registry.
7. Normalize with `summarizeExecutionOutput(result)`.
8. Explain with `explainExecution({ script, result })`.
9. Validate outputs with `validateExecutionOutput(output)` and `validateExecutionExplanation(explanation)` when persisting, testing, or returning machine-readable artifacts.

## Minimal execution pattern

```typescript
const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  return {
    ok: false,
    errors: [...scriptValidation.errors, ...contextValidation.errors],
  };
}

const neuron = new Neuron();
const synapse = new Synapse(neuron);
const result = synapse.execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });

return { ok: output.ok, output, explanation };
```

## Built-in vocabulary

Default `Neuron` registers these built-ins:

- Rule: `simple_rule`
- Condition: `compare_two_numbers`
- Action: `add_two_numbers`
- Parameters: `simple_number`, `simple_string`, `simple_select`, `comparator`

If a project registers custom elements, use only the custom types explicitly provided by that project.

## Schema URLs

Use the official schemas when checking generated artifacts or giving another system contracts:

- Script: https://sebasoft.github.io/neuron-js/schemas/script.schema.json
- Execution context: https://sebasoft.github.io/neuron-js/schemas/execution-context.schema.json
- Execution output: https://sebasoft.github.io/neuron-js/schemas/execution-output.schema.json
- Validation error: https://sebasoft.github.io/neuron-js/schemas/validation-error.schema.json
- Explanation trace: https://sebasoft.github.io/neuron-js/schemas/explanation-trace.schema.json

## Official examples

- Pricing rules: https://github.com/SebaSOFT/neuron-js/tree/main/examples/pricing-rules
- Eligibility check: https://github.com/SebaSOFT/neuron-js/tree/main/examples/eligibility-check
- Workflow routing: https://github.com/SebaSOFT/neuron-js/tree/main/examples/workflow-routing

Public skill example JSON is available under:

- https://sebasoft.github.io/neuron-js/skills/neuron-js/examples/pricing-rules.json
- https://sebasoft.github.io/neuron-js/skills/neuron-js/examples/pricing-input.json
- https://sebasoft.github.io/neuron-js/skills/neuron-js/examples/eligibility-rules.json
- https://sebasoft.github.io/neuron-js/skills/neuron-js/examples/workflow-routing-rules.json

## Prompt recipes

### Generate pricing rules

Use the pricing example as the template. Ask for the decision inputs, discount policy, thresholds, and expected output. Generate JSON only after the policy is clear. Validate before execution.

### Validate generated rules

Run `validateScript(script)`. If `ok` is false, return the `errors` array with `path`, `code`, and `message`. Do not execute the script.

### Explain a decision

Run the script, call `explainExecution({ script, result })`, and return the trace with the normalized output. Use this for audits, snapshots, and workflow logs.

### Migrate if/else to Neuron-JS

Extract inputs, decisions, allowed operations, and outputs. If the logic must be edited without redeploy or shared across systems, convert it to a script. If the logic is simple and stable, recommend keeping TypeScript.

## Output contract for AI agents

When producing an answer or code using Neuron-JS:

- State whether Neuron-JS is the right fit.
- Use only documented package-root exports.
- Validate rules before runtime.
- Include a runnable example or link to the official example.
- Return structured validation errors when invalid.
- Do not silently rewrite user rules without explaining the change.
- Do not claim a CLI exists unless the current package documents one. Use programmatic validation when no CLI is available.

## Verification commands

From a repository checkout:

```bash
yarn lint
yarn test
yarn examples
yarn build
yarn docs:build
```
