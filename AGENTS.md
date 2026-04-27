# neuron-js - AI Agent Context

This document summarizes the architecture, core logic, and product essence of `neuron-js` to guide AI agents in modernizing and maintaining the library.

## Project Vision
`neuron-js` is a pluggable and extensible execution runtime designed to handle functional programming logic in a serializable (JSON-friendly) format. It uses a biological analogy ("neurons", "synapses") to model the registry and flow of execution. The end goal is a robust, well-documented library published as an npm package for both Node.js and browser environments.

## Core Concepts & Architecture

### The Engine
*   **Neuron (The Registry)**: Acts as the central hub for registered component types. It manages the availability of specific Actions, Conditions, Rules, and Parameters.
*   **Synapse (The Executor)**: The runtime engine that takes a `Neuron` instance, an `ExecutionScript`, and an `ExecutionContext` to perform the logic.

### Execution Flow
1.  **ExecutionScript**: A serializable collection of `Rules`.
2.  **Rule**: A logical unit containing:
    *   **Conditions**: Evaluated sequentially. They support logical OR/AND grouping and inversion.
    *   **Actions**: Executed only if the conditions pass.
3.  **ExecutionContext**: A shared state object passed through the entire execution flow. Actions can read from and write to this context, enabling complex data-driven workflows.
4.  **Hooks**: Lifecycle events (e.g., `ON_SCRIPT_START`, `ON_RULE_ERROR`) that allow for monitoring, logging, and side-effect management.

### Elements
*   **Action**: A task or operation (e.g., "AddTwoNumbers", "SendEmail").
*   **Condition**: A logical predicate (e.g., "IsValueGreaterThanX").
*   **Parameter**: Configurable inputs for Actions and Conditions, allowing for reusable logic templates.

## Implementation Guidelines for Modernization
*   **Framework**: Transition from legacy build tools (Parcel) to modern alternatives (e.g., Vite, TSup, or pure ESM).
*   **Type Safety**: Leverage advanced TypeScript features for strict interface definitions and better developer ergonomics.
*   **Serialization**: Ensure the script format remains strictly serializable (JSON) to facilitate storage and remote transmission.
*   **Extensibility**: Maintain the pluggable architecture, making it easy for users to register custom Actions and Conditions.
*   **Testing**: Maintain high test coverage using modern testing frameworks (e.g., Vitest or Jest).

## Documentation Hierarchy
*   `docs/overview.md`: High-level product summary.
*   `docs/concepts/`: Detailed architectural deep-dives.
*   `docs/use-cases/`: Practical application examples.

## Modernization Lessons Learned (April 2026)

- **Biome 2.x Configuration**: Use `vcs` integration (`useIgnoreFile: true`) instead of the deprecated `files.ignore` key to reliably exclude directories like `legacy/` or `dist/`.
- **Vitest & tshy**: Explicitly configure Vitest to include `src/` and exclude `dist/` to prevent execution errors when dual-publishing ESM/CJS modules.
- **Node 24 + Yarn 4**: Leverage Node 24's native TypeScript support with Yarn 4's `node-modules` linker for an optimized and compatible developer feedback loop.
- **Surgical Tooling**: In hybrid repositories (legacy + modern), strictly scope linting and formatting to the modern `src/` directory to maintain high signal-to-noise ratios.
