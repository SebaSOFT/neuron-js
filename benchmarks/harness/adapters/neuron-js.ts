import { Neuron, Synapse } from "../../../dist/esm/index.js";
import {
  ApplyDiscountAction,
  SetDecisionAction,
  SetRouteAction,
  StateNumberParameter,
} from "../neuron-plugins.ts";
import type { Adapter, Decision, Runner, ScenarioDef } from "../types.ts";

/**
 * Neuron-JS adapter. Registers the scenario plugins, then runs the serializable
 * script through Synapse and maps the resulting context to the canonical decision.
 */
export const neuronJsAdapter: Adapter = {
  engine: "@sebasoft/neuron-js",
  prepare(scenario: ScenarioDef): Runner {
    const neuron = new Neuron();
    neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
    neuron.registerAction(ApplyDiscountAction.TYPE, ApplyDiscountAction);
    neuron.registerAction(SetDecisionAction.TYPE, SetDecisionAction);
    neuron.registerAction(SetRouteAction.TYPE, SetRouteAction);
    const synapse = new Synapse(neuron);

    return (): Decision => {
      const result = synapse.execute(
        scenario.neuronScript,
        scenario.neuronInput,
      );
      const matched = (result.value ?? 0) > 0;
      const state = result.context.state as Record<
        string,
        Record<string, unknown>
      >;

      switch (scenario.id) {
        case "pricing-discount": {
          const cart = state.cart ?? {};
          return {
            matched,
            discountAmount: cart.discountAmount as number,
            finalTotal: cart.finalTotal as number,
          };
        }
        case "eligibility-approval": {
          const eligibility = state.eligibility ?? {};
          return {
            matched,
            decision: eligibility.decision as string,
            eligible: eligibility.eligible as boolean,
          };
        }
        case "workflow-routing": {
          const workflow = state.workflow ?? {};
          return {
            matched,
            route: workflow.route as string,
            slaHours: workflow.slaHours as number,
          };
        }
      }
    };
  },
};
