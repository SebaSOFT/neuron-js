import { Engine } from "json-rules-engine";
import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

/**
 * json-rules-engine adapter. Builds one Engine with a single `>=` rule per
 * scenario, then resolves the canonical decision from the fired events. The
 * engine API is promise-based, so the runner is async.
 */
export const jsonRulesEngineAdapter: Adapter = {
  engine: "json-rules-engine",
  prepare(scenario: ScenarioDef): Runner {
    const engine = new Engine();
    engine.addRule({
      conditions: {
        all: [
          {
            fact: scenario.flatFactName,
            operator: "greaterThanInclusive",
            value: scenario.threshold,
          },
        ],
      },
      event: { type: scenario.id },
    });

    return async (): Promise<Decision> => {
      const { events } = await engine.run(scenario.flatFacts);
      return scenario.decide(events.length > 0);
    };
  },
};
