import jsonLogic from "json-logic-js";
import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

/**
 * JsonLogic (json-logic-js) adapter. Expresses each scenario as a `>=` predicate
 * over the nested data and derives the canonical decision from the boolean result.
 */
export const jsonLogicAdapter: Adapter = {
  engine: "json-logic-js",
  prepare(scenario: ScenarioDef): Runner {
    const rule = {
      ">=": [{ var: scenario.factPath }, scenario.threshold],
    };

    return (): Decision => {
      const matched = jsonLogic.apply(rule, scenario.data) === true;
      return scenario.decide(matched);
    };
  },
};
