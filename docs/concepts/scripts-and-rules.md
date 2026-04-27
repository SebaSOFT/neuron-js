# Scripts and Rules

Execution logic in `neuron-js` is defined via an **ExecutionScript**.

## ExecutionScript Structure
A script is essentially a collection of **Rules**. When a script is executed, the engine iterates through these rules in the order they are defined.

## The Anatomy of a Rule
A `Rule` is a self-contained logical unit. It consists of two main parts:
1.  **Conditions**: A list of checks that must pass for the rule to fire.
2.  **Actions**: A list of operations to perform if the conditions pass.

```json
{
  "id": "HighValueCustomerRule",
  "conditions": [...],
  "actions": [...]
}
```

## Condition Logic
Conditions are evaluated sequentially. By default, they follow an **AND** logic (all must be true).

### Advanced Condition Features:
- **Inversion**: A condition can be "inverted" (NOT logic).
- **OR Grouping**: A condition can be marked as an `orCondition`. If the next condition is an `orCondition`, they are treated as a group where only one needs to pass.
- **Disabling**: Rules or individual conditions can be disabled via options without removing them from the script.

## Sequential Execution
If a rule's conditions are met:
1.  The actions within that rule are executed one by one.
2.  Each action can modify the `ExecutionContext`.
3.  The modified context is passed to the next action, and eventually to the next rule in the script.

This sequential nature allows for "pipelining" logic, where earlier rules prepare data or set flags for later rules to consume.
