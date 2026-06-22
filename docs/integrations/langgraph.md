# Use Neuron-JS as a LangGraph deterministic node

Neuron-JS fits LangGraph workflows that need LLM extraction followed by a deterministic Neuron-JS decision.

Target use cases: LangGraph deterministic node, deterministic guardrails for AI agents, validate LLM generated JSON rules, rules engine for AI agents.

## Runnable example

Repository folder: [`examples/langgraph-decision-node/`](https://github.com/SebaSOFT/neuron-js/tree/main/examples/langgraph-decision-node)

```bash
yarn build
node examples/langgraph-decision-node/run.ts
```

## Pattern

1. The LLM extracts/classifies structured data.
2. LangGraph writes that structured data into graph state.
3. Neuron-JS validates the rule script with `validateScript`.
4. Neuron-JS validates the generated context with `validateExecutionContext`.
5. Neuron-JS executes approved rules and returns `summarizeExecutionOutput` plus `explainExecution`.
6. LangGraph routes the next edge from the deterministic output, not free-form LLM text.

## Copy-paste node shape

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
  const context = {
    messages: [],
    state: { classification: state.llmClassification },
  };

  const scriptValidation = validateScript(state.rules);
  const contextValidation = validateExecutionContext(context);

  if (!scriptValidation.ok || !contextValidation.ok) {
    return { ...state, neuronDecision: { ok: false, errors: [...scriptValidation.errors, ...contextValidation.errors] } };
  }

  const result = new Synapse(new Neuron()).execute(state.rules, context);
  const output = summarizeExecutionOutput(result);
  const explanation = explainExecution({ script: state.rules, result });

  return {
    ...state,
    neuronDecision: output,
    neuronExplanation: explanation,
    nextNode: result.context.state.workflow?.nextNode,
  };
}
```

Expected local output:

```json
{
  "ok": true,
  "rulesExecuted": 1,
  "nextNode": "refund-human-review",
  "requiresApproval": true
}
```

## Boundary

Use Neuron-JS when AI-generated or LLM-classified input needs deterministic guardrails. Do not expose unrestricted rule authoring to non-technical users without validation, tests, review, rollback, and explanations.
