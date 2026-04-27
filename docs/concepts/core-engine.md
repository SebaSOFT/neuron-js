# Core Engine: Neuron & Synapse

The architecture of `neuron-js` is built around two primary components: the **Neuron** and the **Synapse**.

## Neuron: The Registry
A `Neuron` instance serves as the central registry for the library. Before any script can be executed, the types of Actions, Conditions, and Rules it uses must be registered with a Neuron.

- **Role**: Catalog of available logic units.
- **Responsibility**: Storing and retrieving definitions based on a unique `type` string.
- **Why?**: This decoupling allows the engine to remain lightweight while being infinitely extensible. You only register the "plugins" your application actually needs.

```typescript
const neuron = new Neuron();
neuron.addActionType('SendSlackNotification', SlackAction);
neuron.addConditionType('IsOrderOverLimit', OrderLimitCondition);
```

## Synapse: The Executor
A `Synapse` instance is the engine that drives execution. It takes a configured `Neuron` and performs the actual work of running a script.

- **Role**: Runtime engine.
- **Responsibility**: Iterating through script rules, evaluating conditions, executing actions, and managing the state transition.
- **Input**: `ExecutionScript`, `ExecutionContext`.
- **Output**: `ExecutionResult`.

```typescript
const synapse = new Synapse(neuron);
const result = synapse.executeScript(myScript, initialContext);
```

## Separation of Concerns
This design ensures that:
1.  **Definitions (Neuron)** are static and reusable.
2.  **Logic (Script)** is dynamic and serializable data.
3.  **Execution (Synapse)** is stateless and predictable.
