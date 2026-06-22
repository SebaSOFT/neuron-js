# n8n Code node deterministic routing recipe

Use this recipe when an n8n workflow needs deterministic workflow routing after collecting ticket or customer data.

Scenario: a support workflow receives a high-priority enterprise ticket with negative sentiment. Neuron-JS validates the JSON rule script and execution context, executes a developer-owned registry, and returns `route: "human-escalation"` with `slaHours: 2`.

## Local validation

From the repository root:

```bash
yarn build
node examples/n8n-code-node/run.ts
```

Expected output:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "route": "human-escalation",
  "slaHours": 2
}
```

The runner exits non-zero if `rules.json`, `input.json`, explanation output, or `expected-output.json` drift.

## n8n setup

Use this in self-hosted or custom n8n environments where external modules are allowed. Keep credentials and side effects in normal n8n nodes. Let Neuron-JS return a route only.

```bash
npm install @sebasoft/neuron-js
```

## Copy-paste Code node snippet

```typescript
const {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} = require('@sebasoft/neuron-js');

const script = $json.rules;
const context = {
  messages: [],
  state: {
    ticket: {
      id: $json.ticket.id,
      priority: $json.ticket.priority,
      customerTier: $json.ticket.customerTier,
      sentimentScore: $json.ticket.sentimentScore,
    },
  },
};

const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  return [{
    json: {
      ok: false,
      errors: [...scriptValidation.errors, ...contextValidation.errors],
    },
  }];
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });

return [{ json: { ...output, explanation } }];
```

## Boundary

Neuron-JS is the deterministic rule layer, not arbitrary business-user code execution. Give product or operations teams controlled rule vocabulary, validation, tests, review, audit, rollback, and explanations. Route downstream side effects from the returned decision in n8n.
