# @sebasoft/neuron-js

## 0.5.2

### Patch Changes

- 9947358: Complete the AI-readable documentation contract with package-level `llms` and `llmsFull` autodiscovery fields, Claude guidance, richer workflow-agent docs, and corrected AI-skill Markdown examples.

## 0.5.1

### Patch Changes

- 8a90267: Add AI-readable documentation assets, `llms.txt`, `llms-full.txt`, assistant instructions, and an official Neuron-JS AI skill for coding agents.

## 0.5.0

### Minor Changes

- 2a6d695: Add JSON Schemas, validation helpers, normalized execution output, and explainability contracts for machine-checking generated or stored rules before runtime and auditing execution traces after a run.

## 0.4.0

### Minor Changes

- c7b6504: Align the documented public API with the package root exports.

  - Exported `Synapse`, `ExecutionResult`, lifecycle hook types, and built-in plugin classes from the package root.
  - Added `AbstractAction` and `AbstractCondition` base classes for custom extension authors.
  - Made runtime `options` handling safe when scripts omit optional `options` objects.
  - Moved tests out of `src` and cleaned the build before packaging to prevent stale test artifacts from reaching `dist`.
  - Updated implementation examples and release documentation for the expanded API surface.

- 06d88f4: Updated GitHub Actions workflows to use Node 24-compatible official actions.

## 0.3.0

### Minor Changes

- 75526ce: First version with docs

## 0.2.0

### Minor Changes

- 25b6e3c: Initial modernized release of neuron-js.

  - Complete clean-room rewrite using Node 24 and Yarn 4.
  - Implemented core registry (Neuron) and execution engine (Synapse).
  - Added support for pluggable Actions, Conditions, and Parameters.
  - Built-in boolean grouping logic (AND/OR) for complex conditions.
  - Centralized lifecycle hooks system.
  - Dual-module support (ESM and CommonJS) via tshy.
