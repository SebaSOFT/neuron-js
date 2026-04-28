# Implementation Examples

This page provides practical examples of how to implement the core interfaces of `neuron-js` to build a custom rules engine tailored to your domain.

## 1. Condition Implementation
Conditions are logical predicates. They should be stateless and only depend on their parameters and the current `ExecutionContext`.

```typescript
import { AbstractCondition, ExecutionResult, ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Checks if the current hour in the context state matches a target.
 */
export class TimeOfDayCondition extends AbstractCondition {
  static TYPE = 'is_time_of_day';

  async execute(context: ExecutionContext): Promise<ExecutionResult<boolean>> {
    // 1. Resolve parameters (e.g., "morning", "afternoon")
    const targetPeriod = this.params.get('period').getValue(context);
    
    // 2. Access state from context
    const currentHour = context.state.systemTime.getHours();
    
    let isMatch = false;
    if (targetPeriod === 'morning') isMatch = currentHour >= 6 && currentHour < 12;
    if (targetPeriod === 'afternoon') isMatch = currentHour >= 12 && currentHour < 18;

    // 3. Return result (Condition value is boolean)
    return new ExecutionResult(isMatch, context, isMatch);
  }
}
```

## 2. Action Implementation
Actions perform side effects or mutate the context state. They are only triggered if the Rule's conditions pass.

```typescript
import { AbstractAction, ExecutionResult, ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Adds a customized audit message to the context.
 */
export class AuditLogAction extends AbstractAction {
  static TYPE = 'audit_log';

  async execute(context: ExecutionContext): Promise<ExecutionResult<void>> {
    const messageTemplate = this.params.get('template').getValue(context);
    const user = context.state.user.name;

    // Mutate the context by adding a new message
    const nextContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: 'info', text: `${user}: ${messageTemplate}` }
      ]
    };

    return new ExecutionResult(true, nextContext);
  }
}
```

## 3. Parameter Implementation
Parameters resolve values. They can be static (hardcoded in JSON) or dynamic (resolving paths in state or environment variables).

```typescript
import { AbstractParameter, ExecutionContext } from '@sebasoft/neuron-js';

/**
 * Resolves a value from an environment variable.
 */
export class EnvVarParameter extends AbstractParameter<string> {
  static TYPE = 'env_var';

  getValue(context: ExecutionContext): string | null {
    // Parameters can use their 'value' property as the key
    const envKey = this.value; 
    return process.env[envKey] || this.defaultValue || null;
  }
}
```

## 4. Context Implementation
While `ExecutionContext` is a flexible interface, you should define a strict schema for your application's state to ensure type safety in your plugins.

```typescript
export interface MyAppContext extends ExecutionContext {
  state: {
    user: { id: string; name: string; loyalty: number };
    cart: { items: any[]; total: number };
    systemTime: Date;
  };
}
```

## 5. Putting It All Together
The following example shows how to register these custom plugins and execute a script that uses them.

```typescript
import { Neuron, Synapse } from '@sebasoft/neuron-js';

// 1. Initialize Registry and register plugins
const registry = new Neuron();
registry.registerCondition(TimeOfDayCondition.TYPE, TimeOfDayCondition);
registry.registerAction(AuditLogAction.TYPE, AuditLogAction);
registry.registerParameter(EnvVarParameter.TYPE, EnvVarParameter);

// 2. Create the Engine
const engine = new Synapse(registry);

// 3. Define Logic (JSON)
const script = {
  id: 'morning-greeting',
  rules: [{
    id: 'greet-rule',
    type: 'simple_rule',
    conditions: [
      { 
        type: 'is_time_of_day', 
        params: [{ name: 'period', type: 'simple_string', value: 'morning' }] 
      }
    ],
    actions: [
      { 
        type: 'audit_log', 
        params: [{ name: 'template', type: 'simple_string', value: 'Good morning!' }] 
      }
    ]
  }]
};

// 4. Run it
const context: MyAppContext = {
  state: {
    user: { id: '1', name: 'Alice', loyalty: 10 },
    cart: { items: [], total: 0 },
    systemTime: new Date() // Suppose it's 9:00 AM
  },
  messages: []
};

const result = engine.execute(script, context);
console.log(result.context.messages); // [{ type: 'info', text: 'Alice: Good morning!' }]
```

## 6. Logical Grouping (AND/OR)
`neuron-js` uses a "Sum of Products" approach to logic. Conditions are grouped into blocks.
- **AND**: All conditions within a block must be true.
- **OR**: If any block is true, the entire rule evaluates to true.

### How to trigger OR
Setting `orCondition: true` on a condition starts a **new block**. This new block is joined to the previous block with an `OR` operator.

### Example: (A AND B) OR (C AND D)
```json
{
  "id": "complex-logic",
  "conditions": [
    { "id": "A", "type": "is_gold_member" },
    { "id": "B", "type": "has_high_balance" },
    { 
      "id": "C", 
      "type": "is_new_user", 
      "options": { "orCondition": true } 
    },
    { "id": "D", "type": "has_promo_code" }
  ]
}
```
**Evaluation Logic**: `(A && B) || (C && D)`

## 7. Condition Inversion (NOT)
Any condition can be negated by setting `inverted: true` in its options. This is handled by the runtime, so your plugin implementation doesn't need to worry about it.

```json
{
  "id": "not-blocked",
  "conditions": [
    { 
      "type": "is_user_blocked", 
      "options": { "inverted": true } 
    }
  ]
}
```
**Evaluation Logic**: `!is_user_blocked`
