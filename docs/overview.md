# neuron-js: Pluggable Execution Runtime

`neuron-js` is a lightweight, extensible, and JSON-serializable execution engine for JavaScript. It allows developers to define complex logic flows (functional scripts) that can be stored in a database, transmitted over the wire, and executed consistently in both Node.js and browser environments.

## The Problem
Hardcoding business logic often leads to rigid systems that are difficult to update without a full deployment. Workflow engines are often heavy, difficult to integrate, or use proprietary formats.

## The Solution
`neuron-js` provides a registry-based approach to execution logic:
- **Neuron (Registry)**: Stores the definitions of what is possible (Actions, Conditions, Rules, Parameters).
- **Synapse (Engine)**: Executes specific scripts by coordinating these definitions in a logical flow.

By keeping the script format strictly serializable (JSON), `neuron-js` enables:
- **Dynamic Logic**: Change business rules at runtime without redeploying code.
- **Portability**: The same logic can run on a backend server or in a client's browser.
- **Extensibility**: Easily add new capabilities by implementing simple Action or Condition interfaces.

## Release Classification
The `0.4.0` release is a **minor capability release**, not a major breaking change.

It expands the documented public API, adds extension base classes, makes missing `options` objects safe at runtime, and cleans package output. Existing JSON script behavior remains compatible; the release gives consumers more stable imports and clearer plugin ergonomics.

## Key Features
- **JSON Serializable**: Logic is data.
- **Shared Context**: State is managed and passed through the execution chain.
- **Logical Grouping**: Complex AND/OR condition logic is supported out of the box.
- **Lifecycle Hooks**: Monitor and react to every step of the execution.
- **Type Safe**: Built with TypeScript for a robust developer experience.
