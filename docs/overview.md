# neuron-js: AI-friendly TypeScript rules engine

`neuron-js` is a lightweight TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.

It lets teams define logic as structured data, execute that logic through a developer-owned registry, and run the same deterministic rules in Node.js or the browser.

## The problem

Hardcoded business logic is fast at first, but it becomes rigid when product, compliance, pricing, routing, eligibility, or workflow rules change often.

Heavy workflow engines solve configurability, but they can add operational weight, proprietary formats, and integration overhead.

## The solution

`neuron-js` keeps business logic as JSON and executes it through a TypeScript registry.

- **Neuron** defines what is allowed: parameters, conditions, actions, and rules.
- **Synapse** executes a serializable script against an execution context.
- **ExecutionContext** carries shared state and messages through the run.
- **Lifecycle hooks** expose script, rule, action, and error events for observability.

This gives applications configurable logic without giving up deterministic execution or developer-owned boundaries.

## Use neuron-js when

- Rules must be stored in a database or versioned in Git.
- Product teams need configurable logic without redeploying code.
- AI-generated rules need validation and approved execution boundaries before runtime.
- Frontend and backend code need to share deterministic decisions.
- Workflow automation needs a predictable decision node instead of probabilistic LLM branching.
- A full BPMN/workflow platform is too heavy for the problem.

## Do not use neuron-js when

- A simple hardcoded condition is clearer and rarely changes.
- Arbitrary user code execution is required.
- You need a full BPMN/process orchestration platform.
- Non-technical users need unrestricted rule authoring without validation, tests, review, and rollback.

## Core architecture

### Neuron: registry

The `Neuron` registry owns the vocabulary of executable elements. By default, it registers built-in parameters, conditions, actions, and rules. Applications can register custom types to expose only approved capabilities.

### Synapse: execution engine

`Synapse` receives a `Neuron`, a serializable script, and an execution context. It evaluates rules, executes actions, and returns an execution result.

### Script

A script is a serializable collection of rules. It can be stored, transmitted, reviewed, and versioned as JSON.

### Rule

A rule combines conditions and actions. Conditions decide whether the rule should run. Actions perform the approved operation.

### Context

The execution context stores messages and shared state for the run. Actions can return updated context for later rules.

### Hooks

Lifecycle hooks let applications monitor execution without embedding observability directly into rule definitions.

## Release classification

The `0.4.0` release is a minor capability release, not a major breaking change.

It expands the documented public API, adds extension base classes, makes missing `options` objects safe at runtime, and cleans package output. Existing JSON script behavior remains compatible; the release gives consumers more stable imports and clearer plugin ergonomics.

## Current and planned adoption assets

Available now:

- npm package: `@sebasoft/neuron-js`
- GitHub repository: <https://github.com/SebaSOFT/neuron-js>
- Documentation site: <https://sebasoft.github.io/neuron-js/>
- Core concepts and use-case documentation in this site

Planned next:

- Runnable examples: `NJS-GROWTH-02`
- JSON Schemas, validation, and explain output: `NJS-GROWTH-03`
- `llms.txt` and AI-assistant documentation: `NJS-GROWTH-04`
- Comparison and migration pages: `NJS-GROWTH-05`

## Key features

- **JSON Serializable**: Logic is data that can be stored, transmitted, and audited.
- **Shared Context**: State and messages pass through the execution chain.
- **Logical Grouping**: AND/OR condition logic is supported by the rule model.
- **Lifecycle Hooks**: Observe execution at script, rule, action, and error boundaries.
- **Type Safe**: Built with TypeScript for a robust developer experience.
