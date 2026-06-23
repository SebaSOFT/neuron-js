// Cold-start probe, run in a fresh Node process by cold-start.ts.
//
// Scenario data is imported BEFORE the timer so only the engine's load +
// first-decision cost is measured. argv: <adapterFile> <scenarioId>.
import { performance } from "node:perf_hooks";
import { scenarios } from "./scenarios.ts";
import type { Adapter } from "./types.ts";

const adapterFile = process.argv[2];
const scenarioId = process.argv[3] ?? "pricing-discount";
const scenario =
  scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

const start = performance.now();
const moduleExports = (await import(`./adapters/${adapterFile}.ts`)) as Record<
  string,
  Adapter
>;
const adapter = Object.values(moduleExports)[0];
const runner = adapter.prepare(scenario);
await runner();
const ms = performance.now() - start;

process.stdout.write(JSON.stringify({ ms }));
