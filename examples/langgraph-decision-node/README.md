# LangGraph deterministic decision node recipe

Use this recipe when a LangGraph workflow needs LLM extraction/classification followed by a deterministic Neuron-JS decision.

Scenario: an LLM classifies a message as a high-risk refund request. Neuron-JS validates the structured context, executes approved JSON rules, and returns `nextNode: "refund-human-review"` with `requiresApproval: true`.

## Local validation

From the repository root:

```bash
yarn build
node examples/langgraph-decision-node/run.ts
```

Expected output:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "nextNode": "refund-human-review",
  "requiresApproval": true
}
```

The local runner intentionally has no LangGraph dependency. It proves the deterministic decision node contract.

## Copy-paste LangGraph node shape

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} from '@sebasoft/neuron-js';

export async function neuronDecisionNode(state) {
  const script = state.refundRoutingRules;
  const context = {
    messages: [],
    state: {
      classification: state.llmClassification,
    },
  };

  const scriptValidation = validateScript(script);
  const contextValidation = validateExecutionContext(context);

  if (!scriptValidation.ok || !contextValidation.ok) {
    return {
      ...state,
      neuronDecision: {
        ok: false,
        errors: [...scriptValidation.errors, ...contextValidation.errors],
      },
    };
  }

  const result = new Synapse(new Neuron()).execute(script, context);
  const output = summarizeExecutionOutput(result);
  const explanation = explainExecution({ script, result });

  return {
    ...state,
    neuronDecision: output,
    neuronExplanation: explanation,
    nextNode: result.context.state.workflow?.nextNode,
  };
}
```

## Boundary

The LLM extracts and classifies. It does not choose the final route from free-form text. Neuron-JS validates the JSON input and produces the deterministic Neuron-JS decision, explanation trace, and stable routing fields used by graph edges.
