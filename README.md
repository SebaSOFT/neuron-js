![neuron-cover640.png](docs/assets/neuron-cover640.png)

# neuron-js

> **A pluggable, serializable rules engine for functional programming rulesets.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Socket Badge](https://badge.socket.dev/npm/package/@sebasoft/neuron-js)](https://socket.dev/npm/package/@sebasoft/neuron-js)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-blue.svg)](https://nodejs.org)
[![Build Status](https://github.com/SebaSOFT/neuron-js/actions/workflows/ci.yml/badge.svg)](https://github.com/SebaSOFT/neuron-js/actions)

`neuron-js` is a lightweight, extensible rules engine designed to execute functional programming logic for other applications in a strictly serializable format. It uses a registry-based architecture—using **Neuron** for component management and **Synapse** as the execution engine—allowing you to build, store, and run complex functional rulesets that remain pure JSON.

Perfect for dynamic business rules, automation workflows, and cross-application decision logic.

---

## ✨ Features

- 🛠 **Pluggable Architecture**: Easily register custom Actions, Conditions, and Parameters.
- 📦 **JSON Serializable**: Logic scripts are pure JSON, perfect for database storage or remote transmission.
- ⚡ **Modern Toolchain**: Built with Node 24, TypeScript, Biome, and Vitest.
- 🌓 **Dual-Module Support**: Native ESM and CommonJS support via `tshy`.
- 🪝 **Lifecycle Hooks**: Comprehensive hook system for monitoring and side-effect management.

---

## 🚀 Quick Start

### Installation

```bash
yarn add @sebasoft/neuron-js
# or
npm install @sebasoft/neuron-js
```

### Basic Usage

```typescript
import { Neuron, Synapse } from '@sebasoft/neuron-js';

// 1. Initialize the registry
const neuron = new Neuron();

// 2. Setup the engine
const synapse = new Synapse(neuron);

// 3. Define your logic script (JSON-serializable)
const script = {
  id: 'hello-script',
  rules: [
    {
      id: 'rule-1',
      type: 'simple_rule',
      options: {},
      conditions: [
        {
          id: 'is-positive',
          type: 'compare_two_numbers',
          params: [
            { name: 'op1', type: 'simple_number', value: '10' },
            { name: 'comp', type: 'comparator', value: '>' },
            { name: 'op2', type: 'simple_number', value: '0' }
          ]
        }
      ],
      actions: [
        {
          id: 'add-log',
          type: 'add_two_numbers',
          params: [
            { name: 'op1', type: 'simple_number', value: '5' },
            { name: 'op2', type: 'simple_number', value: '5' }
          ]
        }
      ]
    }
  ]
};

// 4. Execute
const context = { messages: [], state: {} };
const result = synapse.execute(script, context);

console.log(result.isSuccessful()); // true
console.log(result.value); // 1 (number of rules executed)
```

---

## 🧬 Core Concepts

### Neuron (The Registry)
The `Neuron` acts as the central hub where all element types (Actions, Conditions, Parameters, Rules) are registered. It ensures the runtime knows how to instantiate any element defined in your scripts.

### Synapse (The Executor)
The `Synapse` is the engine that connects a `Neuron` registry to an `ExecutionScript`. It traverses the logic and manages the flow of the `ExecutionContext`.

### Elements
- **Action**: An operation to perform (e.g., "SendEmail", "UpdateDatabase").
- **Condition**: A logical predicate (e.g., "UserIsAdmin", "ValueIsGreaterThanX").
- **Parameter**: Configurable inputs for elements, enabling reusable logic templates.

---

## 💾 Execution Context & State

The `ExecutionContext` is a shared state object that persists throughout the entire execution of a script. It allows Actions and Conditions to communicate and share data.

```typescript
interface ExecutionContext {
  messages: { type: string; text: string }[];
  state: Record<string, any>;
}
```

### Using State in Actions
Actions can read from the context and return an updated context to pass information to subsequent rules.

```typescript
// Example: An action that stores a value in the state
execute(context: ExecutionContext): ExecutionResult {
  const newState = { ...context.state, lastCalculation: 42 };
  return new ExecutionResult(true, { ...context, state: newState });
}
```

---

## 🛠 Development

We use a modern toolchain for high performance and developer ergonomics:

- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Build**: [tshy](https://github.com/isaacs/tshy)
- **Runtime**: [Node.js 24+](https://nodejs.org/)

### Commands

```bash
yarn test    # Run test suite
yarn lint    # Check for linting issues
yarn build   # Generate ESM/CJS bundles
```

---

## 📄 License

MIT © [SebaSOFT](https://github.com/SebaSOFT)
