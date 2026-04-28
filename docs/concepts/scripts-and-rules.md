# Scripts and Rules

Execution logic in `neuron-js` is defined via an **ExecutionScript**.

## ExecutionScript Structure
A script is essentially a collection of **Rules**. When a script is executed, the engine iterates through these rules in the order they are defined.

## The Anatomy of a Rule
A `Rule` is a self-contained logical unit. It consists of two main parts:
1.  **Conditions**: A list of checks that must pass for the rule to fire. If this list is empty, the rule is considered an **"Always"** rule and will always execute its actions.
2.  **Actions**: A list of operations to perform if the conditions pass. If this list is empty, the rule will **"Do Nothing"**—it will evaluate conditions but trigger no side effects.

```json
{
  "id": "HighValueCustomerRule",
  "conditions": [...],
  "actions": [...]
}
```

## Condition Logic
Conditions are evaluated sequentially and follow a **Sum of Products** logic (ANDs grouped by ORs).

### AND Logic
By default, all conditions in the list are joined by **AND**. Every condition must evaluate to `true` for the actions to trigger.

### OR Grouping
You can create an **OR** relationship by setting `orCondition: true` in a condition's options. This starts a **new block** of conditions.
- Each block is evaluated as an **AND** group.
- All blocks are joined by **OR**.
- If **any** block evaluates to `true`, the rule fires.

**Example result**: `(Block 1 AND Block 1) OR (Block 2 AND Block 2)`

### Advanced Features:
- **Inversion**: Set `inverted: true` to negate a condition (NOT logic).
- **Disabling**: Rules or individual conditions can be disabled via options without removing them from the script.

## Sequential Execution
If a rule's conditions are met:
1.  The actions within that rule are executed one by one.
2.  Each action can modify the `ExecutionContext`.
3.  The modified context is passed to the next action, and eventually to the next rule in the script.

This sequential nature allows for "pipelining" logic, where earlier rules prepare data or set flags for later rules to consume.
