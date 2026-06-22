# Use Neuron-JS in n8n for deterministic workflow routing

Neuron-JS can act as an n8n rules engine, n8n decision routing step, workflow automation decision engine, or workflow routing rules layer.

The value is deterministic workflow routing. n8n keeps orchestration and side effects. Neuron-JS validates and executes a JSON decision contract.

## Runnable example

Repository folder: [`examples/n8n-code-node/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/n8n-code-node)

```bash
yarn build
node examples/n8n-code-node/run.ts
```

## Validation-first flow

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
  return [{ json: { ok: false, errors: [...scriptValidation.errors, ...contextValidation.errors] } }];
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });

return [{ json: { ...output, explanation } }];
```

## Code node recipe

In self-hosted/custom n8n environments where external modules are allowed, install `@sebasoft/neuron-js` and use a Code node to execute the validated rule script. Keep credentials, HTTP requests, Slack messages, and database writes in normal n8n nodes after the deterministic route is returned.

Expected local output:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "route": "human-escalation",
  "slaHours": 2
}
```

## Boundary

Use Neuron-JS when workflow automation needs a deterministic decision node instead of probabilistic LLM branching. Do not use it as arbitrary business-user code execution or a full workflow engine. Use controlled rule vocabulary, validation, tests, review, audit, rollback, and explanations.
