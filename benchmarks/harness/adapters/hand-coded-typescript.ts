import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

function readPath(data: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, data);
}

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
