# AI coding assistants

Neuron-JS is intentionally documented for AI coding assistants and workflow agents. This page defines the official usage contract for agents that generate, validate, execute, or explain Neuron-JS rules.

## Canonical machine-readable files

- [`/llms.txt`](/llms.txt): compact agent routing document.
- [`/llms-full.txt`](/llms-full.txt): expanded AI context without navigation chrome.
- [`/skills/neuron-js/SKILL.md`](/skills/neuron-js/SKILL.md): official reusable skill for agent runtimes.
- [`/schemas/script.schema.json`](/schemas/script.schema.json): JSON Schema for scripts and rule definitions.
- [`/schemas/execution-context.schema.json`](/schemas/execution-context.schema.json): JSON Schema for runtime context.
- [`/schemas/execution-output.schema.json`](/schemas/execution-output.schema.json): JSON Schema for normalized execution output.
- [`/schemas/validation-error.schema.json`](/schemas/validation-error.schema.json): JSON Schema for validation errors.
- [`/schemas/explanation-trace.schema.json`](/schemas/explanation-trace.schema.json): JSON Schema for explainability output.

## Assistant rules

1. Import from `@sebasoft/neuron-js` only.
2. Prefer runnable examples as templates.
3. Validate scripts with `validateScript` before execution.
4. Validate contexts with `validateExecutionContext` before execution.
5. If validation fails, return structured errors and stop.
6. Execute with `Synapse` and an approved `Neuron` registry.
7. Summarize with `summarizeExecutionOutput`.
8. Explain with `explainExecution` when decisions are generated, persisted, reviewed, or audited.
9. Do not invent a CLI. Use the documented programmatic APIs unless a future package release documents CLI commands.

## Cursor

Add the official skill to the project context or reference the public skill URL:

```text
https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md
```

Use `.cursor/rules/neuron-js.mdc` in this repository as the Cursor-specific project rule.

## GitHub Copilot and VS Code

Use `.github/copilot-instructions.md` as the repository-level instruction file. It tells Copilot to validate scripts, use package-root exports, and avoid undocumented APIs.

## Claude Code, Hermes, and other skill-aware agents

Load the skill from:

```text
https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md
```

Then implement against the official examples and schemas.

## n8n and LangGraph

Use Neuron-JS as a deterministic decision node after upstream extraction or classification. Do not use it as the side-effect runner. Let n8n or LangGraph route to side-effect nodes after Neuron-JS returns a decision.

## Basic pricing example flow

```typescript
import {
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateScript,
} from '@sebasoft/neuron-js';
```typescript
const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(context);

if (!scriptValidation.ok || !contextValidation.ok) {
  const errors = [
    ...(scriptValidation.errors ?? []),
    ...(contextValidation.errors ?? []),
  ];
  throw new Error(`Invalid Neuron-JS input: ${JSON.stringify(errors)}`);
}

const result = new Synapse(new Neuron()).execute(script, context);
const output = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
```

## Verification

Run these commands before publishing AI docs changes:

```bash
yarn lint
yarn test
yarn examples
yarn build
yarn docs:build
```
