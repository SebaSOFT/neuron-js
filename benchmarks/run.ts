// NJS-GROWTH-07 benchmark harness orchestrator.
//
// Runs the 5-engine x 3-scenario x 3-size matrix, gates fairness (every engine
// must produce the same canonical decision), measures throughput/latency, engine
// cold start, minified bundle size, and Neuron-JS validation/explanation
// overhead, then writes a schema-valid actual_benchmark result file.
//
// Usage: yarn benchmark   (runs `yarn build` first so dist/esm exists)

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { handCodedAdapter } from "./harness/adapters/hand-coded-typescript.ts";
import { jsonLogicAdapter } from "./harness/adapters/json-logic-js.ts";
import { jsonRulesEngineAdapter } from "./harness/adapters/json-rules-engine.ts";
import { neuronJsAdapter } from "./harness/adapters/neuron-js.ts";
import { ruleEngineJsAdapter } from "./harness/adapters/rule-engine-js.ts";
import { measureBundleSizeBytes } from "./harness/bundle-size.ts";
import { measureColdStartMs } from "./harness/cold-start.ts";
import { measure } from "./harness/measure.ts";
import { measureNeuronOverheadMs } from "./harness/overhead.ts";
import {
  benchmarkDate,
  commitSha,
  nodeVersion,
  packageVersion,
} from "./harness/provenance.ts";
import { scenarios } from "./harness/scenarios.ts";
import type { Adapter, Decision } from "./harness/types.ts";

const NEURON_ENGINE = "@sebasoft/neuron-js";

const adapters: Adapter[] = [
  neuronJsAdapter,
  jsonRulesEngineAdapter,
  jsonLogicAdapter,
  handCodedAdapter,
  ruleEngineJsAdapter,
];

const sizes = [
  { input_size: "smoke", warmup: 100, measured: 100 },
  { input_size: "small", warmup: 500, measured: 1_000 },
  { input_size: "medium", warmup: 2_000, measured: 10_000 },
] as const;

const round = (value: number, digits = 6): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

function must<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing ${label}`);
  return value;
}

/** Fairness gate: every engine must reproduce the scenario's canonical decision. */
function assertCanonical(
  engine: string,
  scenarioId: string,
  actual: Decision,
  canonical: Decision,
): void {
  for (const key of Object.keys(canonical)) {
    if (actual[key] !== canonical[key]) {
      throw new Error(
        `Fairness check failed: ${engine} / ${scenarioId} produced ${JSON.stringify(actual)}, expected ${JSON.stringify(canonical)}`,
      );
    }
  }
}

async function main(): Promise<void> {
  const commit = commitSha();

  // Engine-level metrics (constant across scenario/size).
  const coldStart = new Map<string, number>();
  const bundleSize = new Map<string, number>();
  for (const adapter of adapters) {
    coldStart.set(adapter.engine, round(measureColdStartMs(adapter.engine), 3));
    bundleSize.set(
      adapter.engine,
      await measureBundleSizeBytes(adapter.engine),
    );
    process.stderr.write(`measured engine-level metrics: ${adapter.engine}\n`);
  }

  // Neuron-JS validation/explanation overhead, per scenario.
  const neuronOverhead = new Map<
    string,
    { validation_overhead_ms: number; explanation_overhead_ms: number }
  >();
  for (const scenario of scenarios) {
    neuronOverhead.set(scenario.id, await measureNeuronOverheadMs(scenario));
  }

  const results: Record<string, unknown>[] = [];

  for (const adapter of adapters) {
    for (const scenario of scenarios) {
      // Fairness gate before timing.
      const probe = await adapter.prepare(scenario)();
      assertCanonical(adapter.engine, scenario.id, probe, scenario.canonical);

      const isNeuron = adapter.engine === NEURON_ENGINE;
      const overhead = isNeuron
        ? must(neuronOverhead.get(scenario.id), `overhead ${scenario.id}`)
        : { validation_overhead_ms: 0, explanation_overhead_ms: 0 };

      for (const size of sizes) {
        const runner = adapter.prepare(scenario);
        const timing = await measure(runner, size.warmup, size.measured);

        results.push({
          engine: adapter.engine,
          scenario: scenario.id,
          input_size: size.input_size,
          warmup_iterations: timing.warmup_iterations,
          measured_iterations: timing.measured_iterations,
          throughput_decisions_per_second: round(
            timing.throughput_decisions_per_second,
            2,
          ),
          p50_ms: round(timing.p50_ms),
          p95_ms: round(timing.p95_ms),
          cold_start_ms: must(coldStart.get(adapter.engine), "cold start"),
          bundle_size_minified_bytes: must(
            bundleSize.get(adapter.engine),
            "bundle size",
          ),
          validation_overhead_ms: round(overhead.validation_overhead_ms),
          explanation_overhead_ms: round(overhead.explanation_overhead_ms),
          node_version: nodeVersion,
          package_version: packageVersion(adapter.engine),
          commit_sha: commit,
          result_kind: "actual_benchmark",
          notes: isNeuron
            ? "validation/explanation overhead measured as validateScript/explainExecution per-decision deltas"
            : "validation_overhead_ms and explanation_overhead_ms not provided by engine (0)",
        });
      }
      process.stderr.write(
        `measured matrix: ${adapter.engine} / ${scenario.id}\n`,
      );
    }
  }

  const output = {
    schema_version: "1.0.0",
    result_kind: "actual_benchmark",
    is_placeholder: false,
    claims_allowed: true,
    generated_at: benchmarkDate,
    disclaimer:
      "Measured benchmark output. Values reflect this commit, Node version, and the machine that ran `yarn benchmark`; reproduce locally before citing.",
    methodology:
      "Generated by `yarn benchmark` (benchmarks/run.ts). See docs/benchmarks/methodology.md for the competitor set, scenario matrix, input-size matrix, and metric definitions.",
    competitors: adapters.map((adapter) => adapter.engine),
    scenarios: scenarios.map((scenario) => scenario.id),
    input_sizes: sizes.map((size) => size.input_size),
    results,
  };

  const outDir = fileURLToPath(new URL("./results/", import.meta.url));
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}latest.actual.json`;
  writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stderr.write(`\nWrote ${results.length} rows to ${outPath}\n`);
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.stack : String(error)}\n`,
  );
  process.exit(1);
});
