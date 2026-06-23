import type {
  ExecutionContext,
  ScriptInterface,
} from "../../dist/esm/index.js";

/** Canonical decision produced for a scenario, compared across every engine. */
export interface Decision {
  matched: boolean;
  [key: string]: unknown;
}

export type ScenarioId =
  | "pricing-discount"
  | "eligibility-approval"
  | "workflow-routing";

/**
 * One benchmark scenario. Holds everything every adapter needs so adapters stay
 * decoupled from each other: the Neuron-JS script/input, the generic threshold
 * facts for predicate engines, and the canonical decision derivation.
 */
export interface ScenarioDef {
  id: ScenarioId;
  /** Neuron-JS serializable script (reused from examples/). */
  neuronScript: ScriptInterface;
  /** Neuron-JS execution context (reused from examples/). */
  neuronInput: ExecutionContext;
  /** Nested input object for predicate engines (json-logic-js, rule-engine-js). */
  data: Record<string, unknown>;
  /** Dot path of the compared fact, e.g. "cart.subtotal". */
  factPath: string;
  /** Flat facts for json-rules-engine (which resolves top-level fact names). */
  flatFacts: Record<string, number>;
  /** The flat fact name compared by json-rules-engine. */
  flatFactName: string;
  /** Threshold value the fact is compared against with `>=`. */
  threshold: number;
  /** Derives the canonical decision object from a boolean match. */
  decide(matched: boolean): Decision;
  /** The expected canonical decision for the committed input (fairness anchor). */
  canonical: Decision;
}

/** A runner bound to one scenario; sync or async (json-rules-engine is async). */
export type Runner = () => Decision | Promise<Decision>;

/** An engine adapter that prepares a runner for a given scenario. */
export interface Adapter {
  /** Schema `engine` key, e.g. "@sebasoft/neuron-js". */
  engine: string;
  prepare(scenario: ScenarioDef): Runner;
}
