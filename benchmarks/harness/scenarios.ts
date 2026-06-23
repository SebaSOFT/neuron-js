import type { ExecutionContext } from "../../dist/esm/index.js";
import eligibilityInput from "../../examples/eligibility-check/input.json" with {
  type: "json",
};
import eligibilityScript from "../../examples/eligibility-check/rules.json" with {
  type: "json",
};
import pricingInput from "../../examples/pricing-rules/input.json" with {
  type: "json",
};
import pricingScript from "../../examples/pricing-rules/rules.json" with {
  type: "json",
};
import workflowInput from "../../examples/workflow-routing/input.json" with {
  type: "json",
};
import workflowScript from "../../examples/workflow-routing/rules.json" with {
  type: "json",
};
import type { Decision, ScenarioDef } from "./types.ts";

/**
 * The three NJS-GROWTH-07 scenarios. Each is a single numeric-threshold decision
 * whose canonical output matches the runnable example expected-output fixtures, so
 * every engine is measured doing equivalent work.
 */
export const scenarios: ScenarioDef[] = [
  {
    id: "pricing-discount",
    neuronScript: pricingScript,
    neuronInput: pricingInput as ExecutionContext,
    data: { cart: { subtotal: 125, currency: "USD" } },
    factPath: "cart.subtotal",
    flatFacts: { subtotal: 125 },
    flatFactName: "subtotal",
    threshold: 100,
    decide(matched: boolean): Decision {
      if (!matched) return { matched: false };
      const subtotal = 125;
      const discountAmount = Math.round(subtotal * (16 / 100));
      return {
        matched: true,
        discountAmount,
        finalTotal: subtotal - discountAmount,
      };
    },
    canonical: { matched: true, discountAmount: 20, finalTotal: 105 },
  },
  {
    id: "eligibility-approval",
    neuronScript: eligibilityScript,
    neuronInput: eligibilityInput as ExecutionContext,
    data: { applicant: { score: 735, region: "AR" } },
    factPath: "applicant.score",
    flatFacts: { score: 735 },
    flatFactName: "score",
    threshold: 700,
    decide(matched: boolean): Decision {
      return matched
        ? { matched: true, decision: "approved", eligible: true }
        : { matched: false, decision: "denied", eligible: false };
    },
    canonical: { matched: true, decision: "approved", eligible: true },
  },
  {
    id: "workflow-routing",
    neuronScript: workflowScript,
    neuronInput: workflowInput as ExecutionContext,
    data: { ticket: { id: "SUP-1001", priority: 9, channel: "enterprise" } },
    factPath: "ticket.priority",
    flatFacts: { priority: 9 },
    flatFactName: "priority",
    threshold: 8,
    decide(matched: boolean): Decision {
      return matched
        ? { matched: true, route: "escalation", slaHours: 4 }
        : { matched: false, route: "standard", slaHours: 24 };
    },
    canonical: { matched: true, route: "escalation", slaHours: 4 },
  },
];
