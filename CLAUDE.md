# Claude guidance for neuron-js

Neuron-JS is an AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.

Use this file as the Claude-specific entry point. The canonical repository instructions are in [`AGENTS.md`](AGENTS.md), and the AI usage contract is in [`docs/ai-coding-assistants.md`](docs/ai-coding-assistants.md).

## Required workflow

- Import from `@sebasoft/neuron-js` package-root exports only.
- Prefer official examples under `examples/` as templates.
- Validate generated scripts with `validateScript` before execution.
- Validate contexts with `validateExecutionContext` before execution.
- Stop and return structured validation errors when validation fails.
- Execute with `Synapse` and an approved `Neuron` registry.
- Normalize outputs with `summarizeExecutionOutput`.
- Explain audited decisions with `explainExecution`.
- Do not invent CLI commands; use documented programmatic APIs unless a future release documents a CLI.

## Official AI assets

- Compact AI router: `docs/public/llms.txt`
- Full AI context: `docs/public/llms-full.txt`
- Reusable skill: `docs/public/skills/neuron-js/SKILL.md`
- Package-shipped skill: `ai/skills/neuron-js/SKILL.md`
- Schemas: `schemas/*.schema.json`

## Verification

Run the normal project validation before publishing docs or assistant-contract changes:

```bash
yarn lint
yarn test
yarn examples
yarn build
yarn docs:build
```
