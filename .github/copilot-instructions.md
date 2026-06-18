# Copilot instructions for neuron-js

Neuron-JS is an AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.

When generating or editing code in this repository:

- Use Node.js 24+ compatible TypeScript. Avoid constructor parameter properties that native TS stripping does not support.
- Import public APIs from `@sebasoft/neuron-js` or local source exports during internal tests; do not invent undocumented deep imports.
- Preserve the serializable JSON script contract.
- Validate generated rules with `validateScript` before execution.
- Validate contexts with `validateExecutionContext` before execution.
- Use `summarizeExecutionOutput` for stable machine-readable execution output.
- Use `explainExecution` for audit traces.
- Keep official examples runnable with `yarn examples`.
- Keep docs buildable with `yarn docs:build`.
- If no CLI is documented, use programmatic APIs instead of claiming CLI commands exist.
- Prefer small, deterministic examples over broad framework integrations unless the task explicitly asks for integrations.

Useful files:

- `docs/public/llms.txt`
- `docs/public/llms-full.txt`
- `docs/public/skills/neuron-js/SKILL.md`
- `docs/schemas-validation-explainability.md`
- `examples/pricing-rules/`
- `examples/eligibility-check/`
- `examples/workflow-routing/`
- `schemas/*.schema.json`
