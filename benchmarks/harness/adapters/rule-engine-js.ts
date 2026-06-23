import { createRuleEngine, createRuleHelpers } from "rule-engine-js";
import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

/**
 * rule-engine-js adapter (the smaller modern competitor). Builds a `gte`
 * expression over the dot-path fact and derives the canonical decision from
 * `evaluateExpr(...).success`.
 */
export const ruleEngineJsAdapter: Adapter = {
  engine: "rule-engine-js",
  prepare(scenario: ScenarioDef): Runner {
    const engine = createRuleEngine();
    const helpers = createRuleHelpers();
    const expr = helpers.gte(scenario.factPath, scenario.threshold);

    return (): Decision => {
      const matched = engine.evaluateExpr(expr, scenario.data).success === true;
      return scenario.decide(matched);
    };
  },
};
