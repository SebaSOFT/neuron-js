import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/** Maps a schema engine key to its adapter filename stem. */
export const ENGINE_ADAPTER_FILE: Record<string, string> = {
  "@sebasoft/neuron-js": "neuron-js",
  "json-rules-engine": "json-rules-engine",
  "json-logic-js": "json-logic-js",
  "hand-coded-typescript": "hand-coded-typescript",
  "rule-engine-js": "rule-engine-js",
};

const CHILD = fileURLToPath(new URL("./cold-start-child.ts", import.meta.url));

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Measures engine cold start: median wall-clock, across several fresh Node
 * processes, to import the engine adapter and execute the first decision. Node's
 * own startup is excluded — the child starts the timer before importing the
 * engine. Defaults to the pricing scenario.
 */
export function measureColdStartMs(engine: string, runs = 5): number {
  const adapterFile = ENGINE_ADAPTER_FILE[engine];
  if (!adapterFile) throw new Error(`No adapter file for engine ${engine}`);

  const samples: number[] = [];
  for (let i = 0; i < runs; i++) {
    const result = spawnSync(
      process.execPath,
      [CHILD, adapterFile, "pricing-discount"],
      { encoding: "utf8" },
    );
    if (result.status !== 0) {
      throw new Error(
        `Cold-start child failed for ${engine}: ${result.stderr || result.stdout}`,
      );
    }
    samples.push((JSON.parse(result.stdout) as { ms: number }).ms);
  }
  return median(samples);
}
