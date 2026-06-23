import {
  explainExecution,
  Neuron,
  Synapse,
  validateScript,
} from "../../dist/esm/index.js";
import { measure } from "./measure.ts";
import {
  ApplyDiscountAction,
  SetDecisionAction,
  SetRouteAction,
  StateNumberParameter,
} from "./neuron-plugins.ts";
import type { Decision, ScenarioDef } from "./types.ts";

const WARMUP = 2_000;
const MEASURED = 20_000;

function buildSynapse(): Synapse {
  const neuron = new Neuron();
  neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
  neuron.registerAction(ApplyDiscountAction.TYPE, ApplyDiscountAction);
  neuron.registerAction(SetDecisionAction.TYPE, SetDecisionAction);
  neuron.registerAction(SetRouteAction.TYPE, SetRouteAction);
  return new Synapse(neuron);
}

/** Mean per-decision latency in ms, derived from throughput (noise-stable). */
async function meanLatencyMs(runner: () => Decision): Promise<number> {
  const timing = await measure(runner, WARMUP, MEASURED);
  return 1000 / timing.throughput_decisions_per_second;
}

export interface NeuronOverhead {
  validation_overhead_ms: number;
  explanation_overhead_ms: number;
}

/**
 * Neuron-JS validation and explanation overhead for a scenario: the per-decision
 * latency delta of running validateScript (resp. explainExecution) around an
 * otherwise identical execution. Deltas are clamped at 0 (a negative delta is
 * measurement noise meaning "no measurable overhead").
 */
export async function measureNeuronOverheadMs(
  scenario: ScenarioDef,
): Promise<NeuronOverhead> {
  const synapse = buildSynapse();
  const script = scenario.neuronScript;
  const input = scenario.neuronInput;
  const done: Decision = { matched: true };

  const baseline = await meanLatencyMs(() => {
    synapse.execute(script, input);
    return done;
  });

  const withValidation = await meanLatencyMs(() => {
    validateScript(script);
    synapse.execute(script, input);
    return done;
  });

  const withExplanation = await meanLatencyMs(() => {
    const result = synapse.execute(script, input);
    explainExecution({ script, result });
    return done;
  });

  return {
    validation_overhead_ms: Math.max(0, withValidation - baseline),
    explanation_overhead_ms: Math.max(0, withExplanation - baseline),
  };
}
