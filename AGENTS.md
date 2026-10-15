# neuron-js - AI Agent Context

This document summarizes the architecture, core logic, and product essence of `neuron-js` to guide AI agents in modernizing and maintaining the library.

## Project Vision
`neuron-js` is a pluggable and extensible execution runtime designed to handle functional programming logic in a serializable (JSON-friendly) format. It uses a registry-based architecture—using **Neuron** for component management and **Synapse** as the execution engine—allowing you to build, store, and run complex functional rulesets that remain pure JSON. The end goal is a robust, well-documented library published as an npm package for both Node.js and browser environments.

## Core Concepts & Architecture

### The Engine
*   **Neuron (The Registry)**: Acts as the central hub for registered component types. It manages the availability of specific Actions, Conditions, Rules, and Parameters.
*   **Synapse (The Engine)**: The runtime engine that takes a `Neuron` instance, an `ExecutionScript`, and an `ExecutionContext` to perform the logic.

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

## Agent Tooling

This repo is public (`SebaSOFT/neuron-js`), remote `origin` on GitHub, integration branch `main`. PRs
land via GitHub's "Merge pull request" (see `git log --merges`); branch naming in this repo follows
`feat/<slug>`, `fix/<slug>`, `growth/<slug>`, `changeset-release/<branch>`.

### CodeGraph (`mcp__codegraph__codegraph_explore`, shell `codegraph explore "<query>"`)
- A `.codegraph/codegraph.db` index exists at repo root — use CodeGraph **before** grep/find/Read-loops
  for any "where is X" / "how does X work" / blast-radius question.
- One call returns verbatim, line-numbered source (safe to `Edit` from directly) plus call paths and a
  blast-radius list of dependents/tests — usually replaces many grep+Read round-trips.
- Fall back to grep/sed/Read only for what it can't answer well: non-code files (YAML/markdown), exact
  string matches across file types, or once you already know the exact file/line range.

### rtk (Rust Token Killer) — CLI proxy, `/opt/homebrew/bin/rtk`
- Installed and hooked into this session (`PreToolUse` on `Bash` runs `rtk hook claude`), so most shell
  commands (`git`, `gh`, `grep`, `find`, test runners, `npm`/`yarn`, etc.) are auto-rewritten to their
  `rtk` equivalents transparently — no need to type `rtk` manually for those.
- Useful direct commands: `rtk git status|diff|log|show`, `rtk gh pr|issue|run|repo`, `rtk test`,
  `rtk vitest`, `rtk lint`, `rtk tsc`, `rtk grep`/`rtk rg`, `rtk gain` (savings dashboard), `rtk discover`
  (finds missed-optimization opportunities from session history).
- `rtk proxy <cmd>` / `rtk run <cmd>` bypass filtering when raw output is needed for debugging.

### Tavily (`tvly` CLI + `tavily` skill)
- Replaces WebFetch/WebSearch for anything web: search, extract, map, crawl, multi-source research.
- Always pass `--client-name opencode`; write results to `.tavily/` with `-o`/`--output-dir` and
  `--json` rather than dumping raw content into context; add `.tavily/` to `.gitignore` if used here.
- Escalate by need: `tvly search` (no URL yet) → `tvly extract` (have URL(s)) → `tvly map` (find pages
  on a large site) → `tvly crawl` (bulk section) → `tvly research` (multi-source synthesis+citations).

### feature-delivery skill
- **Protocol**: SebaSOFT's end-to-end SDLC protocol (`~/.agents/skills/feature-delivery/SKILL.md`, mirrored into `.claude/skills/`, `.codex/skills/`, and `.gemini/config/skills/`).
- **Prerequisites & Tooling**: Verifies presence of a token saver (`rtk` or `ponytail`), CodeGraph MCP, and OpenSpec CLI (`openspec`), suggesting them if missing.
- **Cycle**: Investigate architecture with CodeGraph → plan with OpenSpec → one branch and one PR per change → run full local gate suite green (`yarn lint`, `yarn test`, `yarn examples`, `yarn build`, `yarn docs:build`) → open PR against `main` → wait for explicit human merge approval (never self-merge).
- **Deferred Spec Promotion**: Archive with `openspec archive <id> --yes`; keep promoted specs (`openspec/specs/`) uncommitted on base branch until making the initial commit on the next branch (`docs(openspec): promote NNNN specs into accepted baseline`).

### git and GitHub CLI (`git`, `gh`)
- Standard git; `gh` for PRs/issues/CI (`gh pr create`, `gh pr checks`, `gh pr view --json ...`,
  `gh run watch`). Both are typically invoked as `rtk git ...` / `rtk gh ...` via the hook above for
  compact output.
- Always create new commits rather than amending; never force-push or skip hooks unless explicitly
  asked; confirm before any destructive git operation.
- `gh pr create` defaults to the repo's default branch (`main`) as base — for this repo that's usually
  correct since there's no separate integration branch, but double-check with `--base` if a feature
  branch should target something other than `main`.

### Agent-browser CLI (`agent-browser`) + skills (`agent-browser skills get core [--full]`)
- Fast Chrome/CDP-based browser automation for AI agents (no Playwright/Puppeteer dependency);
  accessibility-tree snapshots with `@eN` refs keep interactions cheap (~200-400 tokens/action).
- Core loop: `agent-browser open <url>` → `agent-browser snapshot -i` → act on refs (`click`, `fill`,
  `type`, `select`, ...) → re-snapshot after any page change (refs go stale on navigation/re-render).
- Always set an isolated session first: `export AGENT_BROWSER_SESSION="$(agent-browser session id
  --scope worktree --prefix task)"` — the default session is shared across every agent on the machine.
- Use `agent-browser read [url]` for docs/text pages instead of interacting with a rendered UI; supports
  `--outline`, `--filter`, `--llms index|full` for llms.txt-aware doc fetching.
- Load specialized skills (`agent-browser skills get <name>`) for Electron, Slack, exploratory testing,
  protected Vercel deployments, or cloud browser providers — core skill covers everything else.
- Relevant to this repo mainly for verifying `docs/` site output or any future browser-facing demo; not
  part of the current library/test workflow otherwise.

### OpenSpec CLI (`openspec`)
- AI-native spec-driven development tool: `openspec new change <name>` to propose, `openspec validate <name> --strict` to check, `openspec archive <name> --yes` to close out and promote specs into the accepted baseline.
- Key commands: `change` (show/list/validate proposals), `list`/`view` (dashboard), `spec` (manage specs), `context` (print resolved working root), `status`/`instructions` (per-change task state).
- **Initialized in this repo** (`openspec/config.yaml`, `openspec/specs/`, `openspec/changes/`).
