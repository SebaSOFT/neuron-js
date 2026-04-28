# Core Engine: Neuron & Synapse

The architecture of `neuron-js` is built around two primary components: the **Neuron** (Registry) and the **Synapse** (Execution Engine).

## Neuron: The Registry
A `Neuron` instance serves as the central registry for the library. Before any script can be executed, the constructors for Actions, Conditions, and Rules must be registered with a Neuron.

- **Role**: Component Catalog.
- **Responsibility**: Storing and retrieving element definitions based on unique `type` strings.
- **Why?**: This decoupling allows the engine to remain lightweight while being infinitely extensible. You only register the specific logic units your application actually needs.

```typescript
import { Neuron } from '@sebasoft/neuron-js';

const neuron = new Neuron();

// Custom components are registered by type
neuron.registerAction('SendNotification', MyNotificationAction);
neuron.registerCondition('IsOverLimit', MyLimitCondition);
```

## Synapse: The Engine
A `Synapse` instance is the engine that drives execution. It takes a configured `Neuron` registry and performs the actual work of processing a script.

- **Role**: Runtime Engine.
- **Responsibility**: Iterating through script rules, evaluating conditions, executing actions, and managing context state transitions.
- **Input**: `ScriptInterface`, `ExecutionContext`.
- **Output**: `ExecutionResult`.

```typescript
import { Synapse } from '@sebasoft/neuron-js';

const synapse = new Synapse(neuron);
const result = synapse.execute(myScript, initialContext);
```

## Separation of Concerns
This design ensures a clean separation between definitions, data, and execution:
1.  **Definitions (Neuron)**: The "dictionary" of what can be done.
2.  **Logic (Script)**: The JSON-serializable "sentence" describing what to do.
3.  **Execution (Synapse)**: The "reader" that processes the sentence using the dictionary.
