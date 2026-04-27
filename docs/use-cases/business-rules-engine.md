# Use Case: Business Rules Engine

One of the most powerful applications for `neuron-js` is as a dynamic Business Rules Engine (BRE).

## Scenario: E-commerce Discount Logic
An e-commerce platform wants to apply different discount strategies based on user behavior and cart content without redeploying their backend for every seasonal sale.

## The Script
A JSON script can be fetched from a database and executed against the current cart state:

```json
{
  "rules": [
    {
      "id": "BlackFridayVIP",
      "conditions": [
        { "type": "IsSeason", "params": { "season": "BlackFriday" } },
        { "type": "UserHasTag", "params": { "tag": "VIP" } }
      ],
      "actions": [
        { "type": "ApplyDiscount", "params": { "percentage": 25 } }
      ]
    },
    {
      "id": "BulkPurchaseDiscount",
      "conditions": [
        { "type": "CartTotalGreater", "params": { "threshold": 500 } }
      ],
      "actions": [
        { "type": "ApplyDiscount", "params": { "percentage": 10 } }
      ]
    }
  ]
}
```

## How it works
1.  **State**: The `ExecutionContext` is initialized with the current cart and user data.
2.  **Evaluation**: `neuron-js` evaluates the rules sequentially.
3.  **Application**: If a user is both a VIP during Black Friday AND spends over $500, both discounts are applied (or complex logic in the `ApplyDiscount` action handles collision).
4.  **Result**: The final context contains the updated `totalPrice`.

## Benefits
- **Marketing Agility**: Marketing teams can define rules in a UI that generates this JSON.
- **Auditability**: The `ExecutionResult` messages can log exactly which rules were triggered and why.
- **Simulation**: Since the engine is portable, the same rules can be run in a "Simulation Mode" in a dashboard to preview the impact of a new rule before going live.
