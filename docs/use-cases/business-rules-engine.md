# Use Case: Business Rules Engine

`neuron-js` excels as a lightweight, dynamic **Business Rules Engine (BRE)**. It allows you to decouple complex decision logic from your core application code, enabling runtime updates and non-technical management of business policies.

## Scenario: Tiered Loyalty Discounts

Imagine a retail platform that needs to calculate cart discounts based on two factors:
1.  **User Loyalty Tier** (Bronze, Silver, Gold).
2.  **Cart Total Value**.

### 1. The Implementation (Plugins)

First, we define the "building blocks" (Actions and Conditions) that our business team will use to compose rules.

#### Condition: `UserLoyaltyTier`
```typescript
import { AbstractCondition, ExecutionResult } from '@sebasoft/neuron-js';

export class LoyaltyTierCondition extends AbstractCondition {
  static TYPE = 'loyalty_tier_match';

  async execute(context: ExecutionContext): ExecutionResult<boolean> {
    const requiredTier = this.params.get('tier').getValue(context);
    const userTier = context.state.user.loyaltyTier;

    return new ExecutionResult(userTier === requiredTier, context);
  }
}
```

#### Action: `ApplyDiscount`
```typescript
import { AbstractAction, ExecutionResult } from '@sebasoft/neuron-js';

export class ApplyDiscountAction extends AbstractAction {
  static TYPE = 'apply_discount';

  async execute(context: ExecutionContext): ExecutionResult<void> {
    const percentage = this.params.get('percentage').getValue(context);
    const currentTotal = context.state.cart.total;
    
    const discountAmount = currentTotal * (percentage / 100);
    const newTotal = currentTotal - discountAmount;

    const nextContext = {
      ...context,
      state: {
        ...context.state,
        cart: { ...context.state.cart, total: newTotal }
      }
    };

    return new ExecutionResult(true, nextContext);
  }
}
```

### 2. The Rule Script (JSON)

Now, we can define our business logic in a pure JSON format. This could be stored in a database or a configuration file.

```json
{
  "id": "seasonal-discounts-2026",
  "rules": [
    {
      "id": "gold-member-special",
      "type": "simple_rule",
      "conditions": [
        { 
          "type": "loyalty_tier_match", 
          "params": [{ "name": "tier", "type": "simple_string", "value": "GOLD" }] 
        }
      ],
      "actions": [
        { 
          "type": "apply_discount", 
          "params": [{ "name": "percentage", "type": "simple_number", "value": 20 }] 
        }
      ]
    },
    {
      "id": "high-value-bronze",
      "type": "simple_rule",
      "conditions": [
        { 
          "type": "loyalty_tier_match", 
          "params": [{ "name": "tier", "type": "simple_string", "value": "BRONZE" }] 
        },
        {
          "type": "compare_two_numbers",
          "params": [
            { "name": "op1", "type": "path_value", "value": "cart.total" },
            { "name": "comp", "type": "comparator", "value": ">" },
            { "name": "op2", "type": "simple_number", "value": 1000 }
          ]
        }
      ],
      "actions": [
        { 
          "type": "apply_discount", 
          "params": [{ "name": "percentage", "type": "simple_number", "value": 5 }] 
        }
      ]
    }
  ]
}
```

### 3. Execution

The execution engine coordinates the registry and the script to produce a result.

```typescript
import { Neuron, Synapse } from '@sebasoft/neuron-js';

// 1. Setup the Registry
const registry = new Neuron();
registry.registerCondition(LoyaltyTierCondition.TYPE, LoyaltyTierCondition);
registry.registerAction(ApplyDiscountAction.TYPE, ApplyDiscountAction);

// 2. Prepare the Input Context
const context = {
  state: {
    user: { loyaltyTier: 'GOLD' },
    cart: { total: 100 }
  },
  messages: []
};

// 3. Execute the Engine
const engine = new Synapse(registry);
const result = engine.execute(discountScript, context);

if (result.isSuccessful()) {
  console.log(`New Total: ${result.context.state.cart.total}`); // New Total: 80
}
```

## Why use neuron-js for BRE?

- **Hot-Swapping Logic**: Update the JSON script in your database to change pricing strategies instantly without a code deployment.
- **Audit Trails**: Use `Lifecycle Hooks` to log exactly which rules were evaluated and which actions were triggered.
- **Testing & Simulation**: Since the script is data, you can run "What If" simulations by executing production scripts against test contexts in a sandbox environment.
- **Shared Grammar**: Developers define the *capabilities* (Actions/Conditions), while Business Analysts or Admins can define the *logic* (Scripts).
