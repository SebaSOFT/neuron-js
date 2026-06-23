import { readPath } from "../read-path.ts";
import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

/**
 * Hand-coded TypeScript baseline. No engine: a direct `>=` comparison, the
 * floor cost any rules engine is measured against.
 */
export const handCodedAdapter: Adapter = {
  engine: "hand-coded-typescript",
  prepare(scenario: ScenarioDef): Runner {
    return (): Decision => {
      const value = readPath(scenario.data, scenario.factPath);
      const matched = typeof value === "number" && value >= scenario.threshold;
      return scenario.decide(matched);
    };
  },
};

/** Canonical export consumed by the cold-start probe. */
export const adapter = handCodedAdapter;
