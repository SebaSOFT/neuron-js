# Implementation Examples

This page shows how to implement the core extension points of `neuron-js` with the current public API.

The script boundary stays JSON-friendly: rules, actions, conditions, and parameters are arrays with explicit `options` objects. For plugin ergonomics, the abstract action and condition base classes transform the parameter array into a name-keyed `Map`, so plugin code can use `this.params.get('name')`.

## 1. Condition Implementation

Conditions are logical predicates. They should be stateless and depend only on their parameters and the current `ExecutionContext`.

```typescript
import { AbstractCondition, ExecutionResult, type ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Checks if the current hour in the context state matches a target period.
 */
export class TimeOfDayCondition extends AbstractCondition {
  static readonly TYPE = 'is_time_of_day';

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    const targetPeriod = this.params.get('period')?.getValue(context);
    const currentHour = context.state.systemTime.getHours();

    let isMatch = false;
    if (targetPeriod === 'morning') isMatch = currentHour >= 6 && currentHour < 12;
    if (targetPeriod === 'afternoon') isMatch = currentHour >= 12 && currentHour < 18;

    return new ExecutionResult(true, context, isMatch);
  }
}
```

## 2. Action Implementation

Actions perform side effects or return an updated context. They are only triggered if the rule's conditions pass.

```typescript
import { AbstractAction, ExecutionResult, MessageType, type ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Adds a customized audit message to the context.
 */
export class AuditLogAction extends AbstractAction {
  static readonly TYPE = 'audit_log';

  execute(context: ExecutionContext): ExecutionResult<void> {
    const messageTemplate = this.params.get('template')?.getValue(context);
    const user = context.state.user.name;

    const nextContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `${user}: ${messageTemplate}` },
      ],
    };

    return new ExecutionResult(true, nextContext);
  }
}
```

## 3. Parameter Implementation

Parameters resolve values. They can be static, dynamic from context, or backed by another source.

```typescript
import { AbstractParameter, type ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Resolves a value from an environment variable.
 */
export class EnvVarParameter extends AbstractParameter<string> {
  static readonly TYPE = 'env_var';

  getValue(_context: ExecutionContext): string | null {
    const envKey = this.value;
    return envKey ? process.env[envKey] ?? this.defaultValue ?? null : this.defaultValue ?? null;
  }
}
```

## 4. Context Implementation

`ExecutionContext` is intentionally flexible. Define a stricter application-level context for your own plugins.

```typescript
import type { ExecutionContext } from '@sebasoft/neuron-js';

export interface MyAppContext extends ExecutionContext {
  state: {
    user: { id: string; name: string; loyalty: number };
    cart: { items: unknown[]; total: number };
    systemTime: Date;
  };
}
```

## 5. Putting It All Together

The following example registers custom plugins and executes a JSON-serializable script.

```typescript
import { Neuron, Synapse } from '@sebasoft/neuron-js';

const registry = new Neuron();
registry.registerCondition(TimeOfDayCondition.TYPE, TimeOfDayCondition);
registry.registerAction(AuditLogAction.TYPE, AuditLogAction);
registry.registerParameter(EnvVarParameter.TYPE, EnvVarParameter);

const engine = new Synapse(registry);

const script = {
  id: 'morning-greeting',
  rules: [
    {
      id: 'greet-rule',
      type: 'simple_rule',
      options: {},
      conditions: [
        {
          id: 'morning-condition',
          type: 'is_time_of_day',
          options: {},
          params: [
            {
              id: 'period-param',
              name: 'period',
              type: 'simple_string',
              value: 'morning',
              options: {},
            },
          ],
        },
      ],
      actions: [
        {
          id: 'audit-action',
          type: 'audit_log',
          options: {},
          params: [
            {
              id: 'template-param',
              name: 'template',
              type: 'simple_string',
              value: 'Good morning!',
              options: {},
            },
          ],
        },
      ],
    },
  ],
};

const context: MyAppContext = {
  state: {
    user: { id: '1', name: 'Alice', loyalty: 10 },
    cart: { items: [], total: 0 },
    systemTime: new Date(),
  },
  messages: [],
};

const result = engine.execute(script, context);
console.log(result.context.messages);
```

## 6. Logical Grouping (AND/OR)

`neuron-js` uses a "Sum of Products" approach to logic. Conditions are grouped into blocks.

- **AND**: all conditions within a block must be true.
- **OR**: if any block is true, the entire rule evaluates to true.

### How to trigger OR

Setting `orCondition: true` on a condition's `options` starts a new block. This new block is joined to the previous block with an `OR` operator.

### Example: (A AND B) OR (C AND D)

```json
{
  "id": "complex-rule",
  "type": "simple_rule",
  "options": {},
  "actions": [],
  "conditions": [
    { "id": "A", "type": "is_gold_member", "options": {}, "params": [] },
    { "id": "B", "type": "has_high_balance", "options": {}, "params": [] },
    {
      "id": "C",
      "type": "is_new_user",
      "options": { "orCondition": true },
      "params": []
    },
    { "id": "D", "type": "has_promo_code", "options": {}, "params": [] }
  ]
}
```

Evaluation logic: `(A && B) || (C && D)`

## 7. Condition Inversion (NOT)

Any condition can be negated by setting `inverted: true` in its `options`. This is handled by the runtime, so plugin implementations do not need special inversion logic.

```json
{
  "id": "not-blocked-rule",
  "type": "simple_rule",
  "options": {},
  "actions": [],
  "conditions": [
    {
      "id": "not-blocked",
      "type": "is_user_blocked",
      "options": { "inverted": true },
      "params": []
    }
  ]
}
```

Evaluation logic: `!is_user_blocked`
