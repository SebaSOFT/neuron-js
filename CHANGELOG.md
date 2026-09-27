# @sebasoft/neuron-js

## 0.7.5

### Patch Changes

- Standardize the CI toolchain on Node 24: upgrade `actions/checkout` and `actions/setup-node` to v7, migrate `changesets/action` to v2 (explicit `github-token`, `publish-script`, `push-git-tags`), emit ndjson git-tag events from the OIDC publish script, and pin Node 24 via `.nvmrc`.
- Expand SEO and agent-discovery surfaces: add `sitemap.xml`, `robots.txt`, Open Graph and canonical meta tags, and the `google-site-verification` site tag to the documentation site.
- Surface the Jev/Laya governed-decision guide across all AI-readable assets: documentation integrations index, `llms.txt`, `llms-full.txt`, and the official AI skill (packaged `ai/skills` mirror kept byte-identical to the public skill).
- Refresh the published head-to-head benchmark data with a real harness run against 0.7.5 on Node 24 (2026-09), regenerate charts and the results page from the same measured data, and add the citable throughput and bundle-size claims to the README and `llms.txt`.
- Add an example MCP server exposing `validate_script`, `execute_decision`, and `explain_decision` over stdio for AI agents, with contract tests that spawn the real server, an integration guide, and entries across all AI-readable surfaces. The published package keeps zero runtime dependencies; the MCP SDK stays a devDependency.
- Clarify the release classification of this patch in the documentation overview.

## 0.7.0

### Minor Changes

- 11f7a6f: Add an opt-in deterministic decision runtime with validated decision definitions, immutable context evaluation, canonical receipts and replay, portable test vectors, and runnable documentation. Update direct and transitive development dependencies to remediate known vulnerabilities.

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
