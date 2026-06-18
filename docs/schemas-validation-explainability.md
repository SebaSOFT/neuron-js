# Schemas, validation, and explainability

Neuron-JS exposes machine-checkable contracts for stored or AI-generated rules before runtime, then produces a compact explanation object after execution.

Use this page for `NJS-GROWTH-03` adoption work: validate generated JSON, run deterministic decisions, and persist explainable outputs for review or audit trails.

## Contract files

The package ships JSON Schema files in [`schemas/`](https://github.com/SebaSOFT/neuron-js/tree/main/schemas):

- [`script.schema.json`](https://github.com/SebaSOFT/neuron-js/blob/main/schemas/script.schema.json): script, rule, condition, action, and parameter definitions.
- [`execution-context.schema.json`](https://github.com/SebaSOFT/neuron-js/blob/main/schemas/execution-context.schema.json): runtime context with messages and mutable state.
- [`execution-output.schema.json`](https://github.com/SebaSOFT/neuron-js/blob/main/schemas/execution-output.schema.json): normalized execution summary.
- [`validation-error.schema.json`](https://github.com/SebaSOFT/neuron-js/blob/main/schemas/validation-error.schema.json): path-level validation errors.
- [`explanation-trace.schema.json`](https://github.com/SebaSOFT/neuron-js/blob/main/schemas/explanation-trace.schema.json): stable explain output for audits and snapshots.

The same schema files are also published on the documentation site under `/schemas/*.schema.json`.

## Validate before runtime

Use `validateScript` before executing stored or generated rules. This catches missing fields and malformed element contracts before the engine tries to instantiate plugins.

```typescript
import { validateScript } from '@sebasoft/neuron-js';

const validation = validateScript(script);

if (!validation.ok) {
  console.error(validation.errors);
  throw new Error('Invalid Neuron-JS script');
}
```

Validation errors use JSONPath-like paths so humans and coding agents can repair the exact field.

```json
[
  {
    "path": "$.rules[0].actions",
    "code": "required_array",
    "message": "Expected array at $.rules[0].actions."
  }
]
```

## Run deterministic decisions

After validation, execute with the normal `Synapse` engine.

```typescript
import { Neuron, Synapse, validateExecutionContext, validateScript } from '@sebasoft/neuron-js';

const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  throw new Error('Invalid Neuron-JS input');
}

const result = new Synapse(new Neuron()).execute(script, context);
```

## Normalize execution output

Use `summarizeExecutionOutput` when logs, automation workflows, or tests need a stable result object.

```typescript
import { summarizeExecutionOutput, validateExecutionOutput } from '@sebasoft/neuron-js';

const output = summarizeExecutionOutput(result);
const outputValidation = validateExecutionOutput(output);
```

Example output:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "messages": ["Applied 16% discount: -20"]
}
```

## Explain an execution

Use `explainExecution` after a run to produce an audit-friendly trace.

```typescript
import { explainExecution, validateExecutionExplanation } from '@sebasoft/neuron-js';

const explanation = explainExecution({ script, result });
const explanationValidation = validateExecutionExplanation(explanation);
```

Example explanation shape:

```json
{
  "scriptId": "pricing-rules-demo",
  "ok": true,
  "rulesEvaluated": 1,
  "rulesExecuted": 1,
  "messages": ["Applied 16% discount: -20"],
  "trace": [
    {
      "step": 1,
      "type": "script_received",
      "message": "Script pricing-rules-demo contains 1 rule(s)."
    },
    {
      "step": 2,
      "type": "rule_available",
      "ruleId": "vip-order-discount",
      "message": "Rule vip-order-discount has 1 condition(s) and 1 action(s)."
    },
    {
      "step": 3,
      "type": "execution_completed",
      "ruleId": "vip-order-discount",
      "message": "Execution completed with 1 rule(s) executed."
    }
  ]
}
```

## Verify official examples

The repository test suite validates the official example scripts and contexts, and snapshot-tests a pricing-rules explanation trace.

```bash
yarn test tests/contracts/schemas-validation-explainability.test.ts
```

Run all examples separately:

```bash
yarn examples
```
