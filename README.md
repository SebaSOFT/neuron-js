<p align="center">
  <img src="docs/public/img/neuron-cover640.png" alt="neuron-js logo" width="640">
</p>

# neuron-js

> **AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Socket Badge](https://badge.socket.dev/npm/package/@sebasoft/neuron-js)](https://socket.dev/npm/package/@sebasoft/neuron-js)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-blue.svg)](https://nodejs.org)
[![Build Status](https://github.com/SebaSOFT/neuron-js/actions/workflows/ci.yml/badge.svg)](https://github.com/SebaSOFT/neuron-js/actions)

`neuron-js` lets teams define business rules and workflow decisions as pure JSON, execute them deterministically in Node.js or the browser, and extend the rule vocabulary with TypeScript actions, conditions, parameters, rules, and lifecycle hooks.

Use it when hardcoded `if/else` logic is too rigid, but a heavyweight workflow or BPMN platform is too much machinery.

## Links

- Documentation: <https://sebasoft.github.io/neuron-js/>
- npm: <https://www.npmjs.com/package/@sebasoft/neuron-js>
- GitHub: <https://github.com/SebaSOFT/neuron-js>
- Examples: planned under `examples/` as `NJS-GROWTH-02`
- Schemas and validation docs: planned as `NJS-GROWTH-03`
- AI-readable docs: planned as `NJS-GROWTH-04`

---

## Why neuron-js?

Use `neuron-js` when:

- Business rules need to be stored, versioned, audited, or changed without redeploying code.
- Backend and frontend code need to share the same deterministic rule definitions.
- AI assistants or workflow tools generate JSON rules that still need developer-owned validation and execution boundaries.
- Product, pricing, eligibility, routing, or automation decisions change faster than application deployments.
- A full workflow platform is too heavy, but hardcoded conditional logic is too brittle.

Do not use `neuron-js` when a simple hardcoded condition is clearer and rarely changes, when arbitrary user code execution is required, or when you need a full BPMN/process orchestration platform.

---

## ✨ Features

- 🛠 **Pluggable TypeScript registry**: Register custom Actions, Conditions, Parameters, and Rules.
- 📦 **JSON business rules**: Store, transmit, version, and audit logic as serializable JSON.
- ⚡ **Deterministic execution**: Run predictable workflow and business decisions in Node.js or the browser.
- 🪝 **Lifecycle hooks**: Monitor script, rule, action, and error events around execution.
- 🌓 **Dual-module support**: Native ESM and CommonJS bundles via `tshy`.

---

## 🚀 Quick Start

### Installation

```bash
yarn add @sebasoft/neuron-js
# or
npm install @sebasoft/neuron-js
```

### Executable rule example

```typescript
import { Neuron, Synapse } from '@sebasoft/neuron-js';

const neuron = new Neuron();
const synapse = new Synapse(neuron);

const script = {
  id: 'pricing-decision',
  rules: [
    {
      id: 'vip-discount-rule',
      type: 'simple_rule',
      options: {},
      conditions: [
        {
          id: 'minimum-order-value',
          type: 'compare_two_numbers',
          options: {},
          params: [
            { id: 'order-total', name: 'op1', type: 'simple_number', value: '125', options: {} },
            { id: 'comparison', name: 'comp', type: 'comparator', value: '>', options: {} },
            { id: 'threshold', name: 'op2', type: 'simple_number', value: '100', options: {} }
          ]
        }
      ],
      actions: [
        {
          id: 'calculate-discount',
          type: 'add_two_numbers',
          options: {},
          params: [
            { id: 'base-discount', name: 'op1', type: 'simple_number', value: '10', options: {} },
            { id: 'vip-bonus', name: 'op2', type: 'simple_number', value: '5', options: {} }
          ]
        }
      ]
    }
  ]
};

const context = { messages: [], state: {} };
const result = synapse.execute(script, context);

console.log(result.isSuccessful()); // true
console.log(result.value); // 1 rule executed
console.log(result.context.messages.map((message) => message.text)); // includes "Sum result: 15"
```

---

## 🧬 Core Concepts

### Neuron: the registry

The `Neuron` registry knows which parameter, condition, action, and rule types are available. Applications keep control of this registry so generated or stored JSON can only use developer-approved capabilities.

### Synapse: the executor

The `Synapse` engine connects a `Neuron` registry with a serializable script and an execution context. It evaluates rules, applies actions, and emits lifecycle hooks.

### Rule

A Rule is a logical unit containing conditions and actions.

- **No Conditions**: the rule is treated as always eligible.
- **No Actions**: the rule evaluates conditions but performs no operation.

### Elements

- **Action**: An operation to perform, such as writing to context, calculating a value, or triggering an approved side effect.
- **Condition**: A predicate that decides whether a rule should run.
- **Parameter**: A serializable input for actions and conditions.

---

## 💾 Execution Context & State

The `ExecutionContext` is a shared state object that persists through script execution. Actions and conditions can read from it, and actions can return updated context for later rules.

```typescript
interface ExecutionContext {
  messages: { type: string; text: string }[];
  state: Record<string, any>;
}
```

---

## Roadmap-aligned docs

The current public surface focuses on installation, positioning, core concepts, and runtime architecture.

Planned next adoption assets:

- Runnable examples: `NJS-GROWTH-02`
- JSON Schemas, validation, and explain output: `NJS-GROWTH-03`
- `llms.txt` and AI-assistant documentation: `NJS-GROWTH-04`
- Comparison and migration pages: `NJS-GROWTH-05`

---

## 🛠 Development

We use a modern toolchain for high-signal development:

- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Build**: [tshy](https://github.com/isaacs/tshy)
- **Runtime**: [Node.js 24+](https://nodejs.org/)

### Commands

```bash
yarn test    # Run test suite
yarn lint    # Check linting and formatting
yarn build   # Generate ESM/CJS bundles
yarn docs:build # Build API docs and VitePress site
```

---

## 📄 License

MIT © [SebaSOFT](https://github.com/SebaSOFT)
