import { performance } from "node:perf_hooks";
import type { Runner } from "./types.ts";

export interface Timing {
  throughput_decisions_per_second: number;
  p50_ms: number;
  p95_ms: number;
  warmup_iterations: number;
  measured_iterations: number;
}

const MAX_BATCHES = 200;

function percentile(sortedAsc: number[], q: number): number {
  if (sortedAsc.length === 0) return 0;
  const index = Math.min(
    sortedAsc.length - 1,
    Math.floor(q * sortedAsc.length),
  );
  return sortedAsc[index];
}

/**
 * Measures one runner. Warmup iterations run untimed; measured iterations run in
 * batches so per-decision latency is averaged over a batch (avoiding per-call
 * timer overhead dominating sub-microsecond engines like the hand-coded
 * baseline). Throughput is total measured decisions over total measured seconds.
 * p50/p95 are percentiles of the per-batch per-decision latencies.
 */
export async function measure(
  runner: Runner,
  warmupIterations: number,
  measuredIterations: number,
): Promise<Timing> {
  const isAsync = runner() instanceof Promise;

  if (isAsync) {
    for (let i = 0; i < warmupIterations; i++) await runner();
  } else {
    for (let i = 0; i < warmupIterations; i++) runner();
  }

  const batches = Math.min(MAX_BATCHES, measuredIterations);
  const batchSize = Math.max(1, Math.floor(measuredIterations / batches));
  const totalDecisions = batches * batchSize;
  const perDecisionMs = new Array<number>(batches);

  const start = performance.now();
  if (isAsync) {
    for (let b = 0; b < batches; b++) {
      const t0 = performance.now();
      for (let i = 0; i < batchSize; i++) await runner();
      perDecisionMs[b] = (performance.now() - t0) / batchSize;
    }
  } else {
    for (let b = 0; b < batches; b++) {
      const t0 = performance.now();
      for (let i = 0; i < batchSize; i++) runner();
      perDecisionMs[b] = (performance.now() - t0) / batchSize;
    }
  }
  const elapsedMs = performance.now() - start;

  const sorted = [...perDecisionMs].sort((a, b) => a - b);

  return {
    throughput_decisions_per_second: totalDecisions / (elapsedMs / 1000),
    p50_ms: percentile(sorted, 0.5),
    p95_ms: percentile(sorted, 0.95),
    warmup_iterations: warmupIterations,
    measured_iterations: totalDecisions,
  };
}
