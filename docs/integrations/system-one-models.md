# Govern Jev or Laya decisions with Neuron-JS

Jev and Laya answer narrow, typed questions such as `choice`, `score`, and `noul` (a boolean probability). They are useful as a **decision provider**, not as an unrestricted workflow runtime.

Neuron-JS should own the deterministic boundary: validate the provider result, apply versioned JSON rules, record the explanation, and emit an approved action request. A separate executor performs the real side effect only after authorization, idempotency, and approval checks.

This pattern works with Jev through its hosted API and with Laya behind a local HTTP service or application adapter. Laya's official runtime is Python-based; Neuron-JS does not bundle a JavaScript Laya runtime.

## Ownership boundary

| Layer | Owns | Must not own |
| --- | --- | --- |
| Jev or Laya | Classification, ranking, score, probability | Database writes, email, payments, deployment, or authorization |
| Neuron-JS | Validation, deterministic conditions, policy version, audit trace, approved intent | Model inference or secret management |
| Effect executor | Authenticated, idempotent delivery of an already-approved intent | Reinterpreting model prose or policy |

The model can recommend `billing`, `security`, or `human_review`. It cannot call `sendEmail`, `deploy`, or `chargeCard` directly.

## Example: ticket decision to governed action

The application first requests a typed model decision. Keep provider credentials on the server. Normalize only the fields the policy needs.

```typescript
import {
  AbstractAction,
  AbstractCondition,
  ExecutionResult,
  HookEvents,
  MessageType,
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
  type ExecutionContext,
  type HookEmitter,
} from '@sebasoft/neuron-js';

type Decision = {
  provider: 'jev' | 'laya';
  model: string;
  choice: 'billing' | 'technical' | 'human_review';
  confidence: number;
  isPhishing: number;
};

type OutboxItem = {
  idempotencyKey: string;
  kind: 'assign-ticket' | 'human-review';
  payload: Record<string, unknown>;
};

type TicketContext = ExecutionContext & {
  state: {
    ticket: { id: string; body: string };
    decision: Decision;
    outbox?: OutboxItem[];
  };
};

function isDecision(value: unknown): value is Decision {
  if (typeof value !== 'object' || value === null) return false;
  const decision = value as Partial<Decision>;
  return (
    (decision.provider === 'jev' || decision.provider === 'laya') &&
    typeof decision.model === 'string' &&
    ['billing', 'technical', 'human_review'].includes(decision.choice ?? '') &&
    typeof decision.confidence === 'number' &&
    decision.confidence >= 0 &&
    decision.confidence <= 1 &&
    typeof decision.isPhishing === 'number' &&
    decision.isPhishing >= 0 &&
    decision.isPhishing <= 1
  );
}

class DecisionMatchesCondition extends AbstractCondition {
  static readonly TYPE = 'decision_matches';

  execute(context: TicketContext): ExecutionResult<boolean> {
    const expectedChoice = this.params.get('choice')?.getValue(context);
    const minimumConfidence = this.params.get('minimumConfidence')?.getValue(context);
    const decision = context.state.decision;
    const matches =
      typeof expectedChoice === 'string' &&
      typeof minimumConfidence === 'number' &&
      decision.choice === expectedChoice &&
      decision.confidence >= minimumConfidence &&
      decision.isPhishing < 0.5;

    return new ExecutionResult(true, context, matches);
  }
}

class QueueApprovedIntentAction extends AbstractAction {
  static readonly TYPE = 'queue_approved_intent';

  execute(context: TicketContext): ExecutionResult<void> {
    const kind = this.params.get('kind')?.getValue(context);
    if (kind !== 'assign-ticket' && kind !== 'human-review') {
      return new ExecutionResult(false, context, null, ['Unsupported intent kind']);
    }

    const item: OutboxItem = {
      idempotencyKey: `ticket:${context.state.ticket.id}:${kind}`,
      kind,
      payload: {
        ticketId: context.state.ticket.id,
        choice: context.state.decision.choice,
        confidence: context.state.decision.confidence,
      },
    };

    return new ExecutionResult(true, {
      ...context,
      state: { ...context.state, outbox: [...(context.state.outbox ?? []), item] },
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `Approved intent queued: ${kind}` },
      ],
    });
  }
}
```

The condition is deterministic: it only reads a previously validated decision from `ExecutionContext`. The action queues an intent in an **outbox**. It does not send a message, alter money, or invoke a deployment API.

## JSON policy

Rules remain serializable and can be reviewed, versioned, validated, and rolled back independently of the model provider.

```typescript
const policy = {
  id: 'ticket-routing-v1',
  rules: [
    {
      id: 'assign-billing-with-high-confidence',
      type: 'simple_rule',
      options: {},
      conditions: [
        {
          id: 'billing-high-confidence',
          type: 'decision_matches',
          options: {},
          params: [
            { id: 'choice', name: 'choice', type: 'simple_string', value: 'billing', options: {} },
            { id: 'confidence', name: 'minimumConfidence', type: 'simple_number', value: '0.85', options: {} },
          ],
        },
      ],
      actions: [
        {
          id: 'queue-billing-assignment',
          type: 'queue_approved_intent',
          options: {},
          params: [
            { id: 'kind', name: 'kind', type: 'simple_string', value: 'assign-ticket', options: {} },
          ],
        },
      ],
    },
  ],
};
```

## Execute the deterministic boundary

```typescript
let decision: unknown;
try {
  decision = await decisionProvider.classify({
    ticket: { id: 'T-1042', body: 'Please refund the duplicate charge.' },
  });
} catch {
  return {
    ok: false,
    diagnostic: 'MODEL_DECISION_INVALID',
    next: 'human review',
  };
}

if (!isDecision(decision)) {
  return {
    ok: false,
    diagnostic: 'MODEL_DECISION_INVALID',
    next: 'human review',
  };
}

// Normalize: keep only the fields the policy needs; drop everything else
// the provider returned.
const normalized: Decision = {
  provider: decision.provider,
  model: decision.model,
  choice: decision.choice,
  confidence: decision.confidence,
  isPhishing: decision.isPhishing,
};

const context: TicketContext = {
  messages: [],
  state: {
    ticket: { id: 'T-1042', body: 'Please refund the duplicate charge.' },
    decision: normalized,
  },
};

const policyValidation = validateScript(policy);
const contextValidation = validateExecutionContext(context);
if (!policyValidation.ok || !contextValidation.ok) {
  return {
    ok: false,
    diagnostic: 'POLICY_OR_CONTEXT_INVALID',
    next: 'human review',
    errors: [...policyValidation.errors, ...contextValidation.errors],
  };
}

const neuron = new Neuron();
neuron.registerCondition(DecisionMatchesCondition.TYPE, DecisionMatchesCondition);
neuron.registerAction(QueueApprovedIntentAction.TYPE, QueueApprovedIntentAction);

const result = new Synapse(neuron).execute(policy, context);

if (!result.isSuccessful()) {
  return {
    ok: false,
    diagnostic: 'POLICY_EXECUTION_FAILED',
    next: 'human review',
  };
}

const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script: policy, result });

return { output, explanation, outbox: result.context.state.outbox ?? [] };
```

## Laya as a boolean engine and context selector

`Synapse.execute()` is synchronous; Jev and Laya inference is a network or GPU call. **Plugins must never perform I/O.** The correct pattern is to prefetch every model answer before execution, store the answers in `ExecutionContext`, and let the condition do a deterministic compare and the action a validated context write.

### Prefetch model answers

Question sentences can reference context placeholders. Interpolate them before calling the provider, so the provider only ever sees concrete text.

```typescript
function interpolate(
  template: string,
  state: Record<string, unknown>,
): string {
  return template.replace(/\{([\w.]+)\}/g, (_, path: string) => {
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, key) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[key]
            : undefined,
        state,
      );
    return value === undefined ? '' : String(value);
  });
}

type ModelAnswer =
  | { kind: 'noul'; noul: number; confidence: number; question: string }
  | { kind: 'choice'; choice: string; confidence: number; question: string };

type ModelContext = ExecutionContext & {
  state: {
    usuario: { role: string; avatarURL: string; theme?: string };
    modelAnswers: Record<string, ModelAnswer>;
  };
};

const state = {
  usuario: { role: 'moderator', avatarURL: 'https://cdn.example.com/u/42.png' },
};

// Built before Synapse.execute(): one provider call answers every question
// the policy will need. The question text is stored for audit.
const modelAnswers: Record<string, ModelAnswer> = await decisionProvider.ask(state, {
  isAdmin: {
    type: 'noul',
    instructions: interpolate('Es el {usuario.role} un admin?', state),
  },
  avatarTheme: {
    type: 'choice',
    instructions: interpolate(
      'Que color predomina en el avatar {usuario.avatarURL}?',
      state,
    ),
    criteria: {
      azul: 'tonos azules',
      rojo: 'tonos rojos',
      amarillo: 'tonos amarillos',
      verde: 'tonos verdes',
      naranja: 'tonos naranjas',
      violeta: 'tonos violetas',
      celeste: 'tonos celestes',
    },
  },
});
```

The app validates `modelAnswers` (each `noul` and `confidence` in `0..1`, each `choice` inside the allowlist) before execution, exactly like `isDecision` in the ticket example.

### Condition: LayaBooleanEvaluator

The condition never calls Laya. It does a deterministic compare against the prefetched `noul` probability.

The two return channels map to the engine's real semantics:

- `ExecutionResult(true, context, matches)` with `matches === false` means "the model said no": the rule does not fire, the script continues.
- `ExecutionResult(false, context, false, [...])` means "this condition is broken" (missing answer, bad config): `ConditionRuntime` emits `ON_CONDITION_ERROR` and the whole script aborts with `success: false`. That is the fail-closed path for `MODEL_ANSWER_MISSING`.

The same split applies to the selector action: a low-confidence or off-allowlist choice is a broken action (`success: false`, `ON_ACTION_ERROR`, script aborts), not a soft skip.

```typescript
class LayaBooleanEvaluator extends AbstractCondition {
  static readonly TYPE = 'laya_boolean';

  execute(context: ModelContext): ExecutionResult<boolean> {
    const questionId = this.params.get('questionId')?.getValue(context) as
      | string
      | undefined;
    const expected = this.params.get('expected')?.getValue(context) as
      | string
      | undefined;
    const minimumConfidence = this.params.get('minimumConfidence')?.getValue(
      context,
    ) as number | undefined;

    if (!questionId || (expected !== 'true' && expected !== 'false')) {
      return new ExecutionResult(false, context, false, [
        'Missing questionId or expected value',
      ]);
    }

    const answer = context.state.modelAnswers[questionId];
    if (!answer || answer.kind !== 'noul') {
      return new ExecutionResult(false, context, false, [
        `MODEL_ANSWER_MISSING: ${questionId}`,
      ]);
    }

    const threshold = minimumConfidence ?? 0.85;
    const matches =
      expected === 'true'
        ? answer.noul >= 0.5 && answer.confidence >= threshold
        : answer.noul < 0.5;

    return new ExecutionResult(true, context, matches);
  }
}
```

### Action: LayaSelectorAction

The action writes one allowlisted value into a context path. Low confidence or an off-allowlist choice fails the action; the context is not partially mutated.

```typescript
const THEME_OPTIONS = [
  'azul',
  'rojo',
  'amarillo',
  'verde',
  'naranja',
  'violeta',
  'celeste',
] as const;

class LayaSelectorAction extends AbstractAction {
  static readonly TYPE = 'laya_selector';

  execute(context: ModelContext): ExecutionResult<void> {
    const questionId = this.params.get('questionId')?.getValue(context) as
      | string
      | undefined;
    const targetPath = this.params.get('target')?.getValue(context) as
      | string
      | undefined;
    const minimumConfidence = this.params.get('minimumConfidence')?.getValue(
      context,
    ) as number | undefined;

    if (!questionId || !targetPath) {
      return new ExecutionResult(false, context, null, [
        'Missing questionId or target',
      ]);
    }

    const answer = context.state.modelAnswers[questionId];
    if (!answer || answer.kind !== 'choice') {
      return new ExecutionResult(false, context, null, [
        `MODEL_ANSWER_MISSING: ${questionId}`,
      ]);
    }

    if (answer.confidence < (minimumConfidence ?? 0.8)) {
      return new ExecutionResult(false, context, null, [
        `MODEL_CONFIDENCE_LOW: ${answer.confidence}`,
      ]);
    }

    if (!THEME_OPTIONS.includes(answer.choice as (typeof THEME_OPTIONS)[number])) {
      return new ExecutionResult(false, context, null, [
        `MODEL_CHOICE_OUTSIDE_ALLOWLIST: ${answer.choice}`,
      ]);
    }

    const nextState = structuredClone(context.state);
    const segments = targetPath.split('.');
    let node: Record<string, unknown> = nextState as Record<string, unknown>;
    for (const segment of segments.slice(0, -1)) {
      if (typeof node[segment] !== 'object' || node[segment] === null) {
        return new ExecutionResult(false, context, null, [
          `TARGET_PATH_INVALID: ${targetPath}`,
        ]);
      }
      node = node[segment] as Record<string, unknown>;
    }
    node[segments[segments.length - 1]] = answer.choice;

    return new ExecutionResult(true, {
      ...context,
      state: nextState,
      messages: [
        ...context.messages,
        {
          type: MessageType.INFO,
          text: `${targetPath} = ${answer.choice}`,
        },
      ],
    });
  }
}
```

### Policy

Note the hook contract in this policy: `Synapse` accepts a `HookEmitter` as its second constructor argument (or as the third `execute()` argument for one run). The engine emits `ON_SCRIPT_START`, `ON_RULE_START`, `ON_CONDITION_START/END`, `ON_ACTION_START/END`, `ON_RULE_END`, `ON_SCRIPT_END`, and the `*_ERROR` variants, always passing the current `ExecutionContext`. Hooks are synchronous observers: use them for audit logging and telemetry, never to mutate the context mid-run or to perform I/O.

```typescript
const policy = {
  id: 'laya-user-theme-v1',
  rules: [
    {
      id: 'admins-get-model-chosen-theme',
      type: 'simple_rule',
      options: {},
      conditions: [
        {
          id: 'is-admin',
          type: 'laya_boolean',
          options: {},
          params: [
            { id: 'q', name: 'questionId', type: 'simple_string', value: 'isAdmin', options: {} },
            { id: 'e', name: 'expected', type: 'simple_string', value: 'true', options: {} },
            { id: 'c', name: 'minimumConfidence', type: 'simple_number', value: '0.85', options: {} },
          ],
        },
      ],
      actions: [
        {
          id: 'set-theme-from-avatar',
          type: 'laya_selector',
          options: {},
          params: [
            { id: 'q', name: 'questionId', type: 'simple_string', value: 'avatarTheme', options: {} },
            { id: 't', name: 'target', type: 'simple_string', value: 'usuario.theme', options: {} },
          ],
        },
      ],
    },
  ],
};
```

After execution, `context.state.usuario.theme` holds the selected color when the rule fired. `MODEL_ANSWER_MISSING`, `MODEL_CONFIDENCE_LOW`, `MODEL_CHOICE_OUTSIDE_ALLOWLIST`, and `TARGET_PATH_INVALID` all fail closed: no context write, no outbox item, human review.

### Wiring the run with hooks and registry

`Synapse` takes the registry first and an optional `HookEmitter` second; `execute()` accepts a per-run emitter as its third argument. Custom condition and action types must be registered on the `Neuron` instance or the runtime will abort with `Condition type not found` / `Action type not found` and emit the corresponding `*_ERROR` hook.

```typescript
const auditLog: unknown[] = [];

const hookEmitter: HookEmitter = (event, context) => {
  // Synchronous observer only: audit what happened, change nothing.
  auditLog.push({ event, rulesExecutedSoFar: context.state.rulesExecuted });
};

const neuron = new Neuron();
neuron.registerCondition(LayaBooleanEvaluator.TYPE, LayaBooleanEvaluator);
neuron.registerAction(LayaSelectorAction.TYPE, LayaSelectorAction);

const context: ModelContext = {
  messages: [],
  state: {
    usuario: { role: 'moderator', avatarURL: 'https://cdn.example.com/u/42.png' },
    modelAnswers, // validated before this point
  },
};

const result = new Synapse(neuron, hookEmitter).execute(policy, context);

if (!result.isSuccessful()) {
  // ON_SCRIPT_ERROR already fired; keep the audit trail and fail closed.
  return { ok: false, diagnostic: 'POLICY_EXECUTION_FAILED', auditLog };
}

return {
  ok: true,
  theme: result.context.state.usuario.theme,
  messages: result.context.messages,
  auditLog,
};
```

The `usuario.role` / `usuario.avatarURL` values in this run are known before execution, so a plain condition could compare `role` directly. The model-backed condition earns its place only when the judgment needs unstructured data; see the next section.

### When the boolean question is worth asking

If the fact is already in the context, prefer a plain deterministic condition. `Es el {usuario.role} un admin?` with `role` present is answerable by code. Reserve `laya_boolean` for judgments over unstructured data the code cannot compare itself, such as "does this user's profile suggest administrative responsibility?" or "does this message contain an implicit refund request?". The pattern is the same either way; the difference is whether the model adds information or only restates the context.

## Failure path: no model output, no effect

`MODEL_DECISION_INVALID` is an intentional terminal diagnostic. It covers timeouts, malformed provider output, out-of-range probabilities, and a choice outside the policy allowlist. The system routes to **human review** and creates no outbox item, so no downstream effect can run.

Likewise, a valid but low-confidence result must be modeled explicitly. Add a `human_review` rule that queues `human-review`, rather than silently falling through to a privileged action.

## Production controls

1. Use a server-side adapter for Jev or Laya. Do not expose provider keys or a privileged Laya endpoint to browsers.
2. Store the provider name, model identifier, raw response hash, normalized decision, policy version, and `explainExecution` trace for audit.
3. Keep policy allowlists narrow. A `choice` becomes an action only when the policy maps it to a known intent.
4. Process the outbox with authentication, authorization, idempotency, retry policy, and a human approval gate for irreversible operations.
5. Fail closed for security, money movement, production deployments, and external communication. A model confidence number is not authorization.

## When to call which model

Use Jev when a managed hosted decision API is acceptable. Use Laya when local deployment, data residency, or fine-tuning outweighs the cost of operating model inference. In both cases the integration contract above stays the same: model output is advisory; Neuron-JS policy is the deterministic boundary.
