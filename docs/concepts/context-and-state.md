# Context, State, and Hooks

Managing state effectively is critical for dynamic logic engines. `neuron-js` uses the **ExecutionContext** to achieve this.

## ExecutionContext
The `ExecutionContext` is a shared object that travels with the execution flow.

- **Storage**: It typically holds a `state` object (the primary data being processed) and a `messages` list (for logging/audit trails).
- **Mutations**: Actions can return a modified version of the context. This allows an action to "enrich" the state for subsequent elements.
- **Access**: Both Conditions and Actions have full access to the context, allowing them to make decisions or perform tasks based on the current state of the system.

## ExecutionResult
When a script finishes (or fails), the `Synapse` returns an `ExecutionResult`. This object contains:
- **Success Flag**: Whether the execution completed without runtime errors.
- **Final Context**: The state after all successful actions have run.
- **Metadata**: Information such as the number of rules executed and any error/info messages collected during the run.

## Lifecycle Hooks
Hooks allow external systems to monitor and react to the execution engine's internal states.

Common Hook Events:
- `ON_SCRIPT_START` / `ON_SCRIPT_END`
- `ON_RULE_START` / `ON_RULE_END`
- `ON_CONDITION_START` / `ON_ACTION_START`
- `ON_ERROR` (Generic or specific to elements)

### Use Cases for Hooks:
- **Logging**: Send execution logs to a centralized system (e.g., ELK stack).
- **Telemetry**: Track how many times certain rules are firing.
- **Debugging**: Inspect the context at specific breakpoints in the execution.
