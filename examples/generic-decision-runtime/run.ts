import {
  AbstractAction,
  AbstractCondition,
  AbstractParameter,
  evaluateDecision,
  ExecutionResult,
  Neuron,
  type DecisionDefinition,
  type ExecutionContext,
} from "../../dist/esm/index.js";
import context from "./context.json" with { type: "json" };
import definition from "./definition.json" with { type: "json" };
import expectedOutput from "./expected-output.json" with { type: "json" };

class StateNumberParameter extends AbstractParameter<number | string> {
  static readonly TYPE = "state_number";

  getValue(context: ExecutionContext): number | null {
    const value = context.state[String(this.value)];
    return typeof value === "number" ? value : null;
  }
}

class StateStringParameter extends AbstractParameter<string> {
  static readonly TYPE = "state_string";

  getValue(context: ExecutionContext): string | null {
    const value = context.state[this.value ?? ""];
    return typeof value === "string" ? value : null;
  }
}

class StateNumberAtLeastCondition extends AbstractCondition {
  static readonly TYPE = "state_number_at_least";

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    const value = this.params.get("value")?.getValue(context);
    const minimum = this.params.get("minimum")?.getValue(context);

    if (typeof value !== "number" || typeof minimum !== "number") {
      return new ExecutionResult(false, context, false, [
        "state_number_at_least requires numeric value and minimum parameters",
      ]);
    }

    return new ExecutionResult(true, context, value >= minimum);
  }
}

class EmitGenericOutcomeAction extends AbstractAction {
  static readonly TYPE = "emit_generic_outcome";

  execute(context: ExecutionContext): ExecutionResult<void> {
    const observed = this.params.get("observed")?.getValue(context);
    const minimum = this.params.get("minimum")?.getValue(context);
    const label = this.params.get("label")?.getValue(context);

    if (
      typeof observed !== "number" ||
      typeof minimum !== "number" ||
      typeof label !== "string"
    ) {
      return new ExecutionResult(false, context, undefined, [
        "emit_generic_outcome requires observed, minimum, and label parameters",
      ]);
    }

    return new ExecutionResult(true, {
      ...context,
      state: {
        ...context.state,
        outcome: {
          result: "passed",
          observed,
          minimum,
          label,
        },
      },
    });
  }
}

const neuron = new Neuron();
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter as any);
neuron.registerParameter(StateStringParameter.TYPE, StateStringParameter as any);
neuron.registerCondition(StateNumberAtLeastCondition.TYPE, StateNumberAtLeastCondition);
neuron.registerAction(EmitGenericOutcomeAction.TYPE, EmitGenericOutcomeAction);

const evaluation = evaluateDecision({
  definition: definition as DecisionDefinition,
  context,
  neuron,
  correlation: { correlationId: "generic-example" },
});

const actual = {
  status: evaluation.status,
  outcome: evaluation.outcome,
  receiptIdentity: {
    decisionId: evaluation.receipt.decisionId,
    decisionVersion: evaluation.receipt.decisionVersion,
    status: evaluation.receipt.status,
    runtimeVersion: evaluation.receipt.runtimeVersion,
  },
  diagnostics: evaluation.diagnostics,
};

if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
  throw new Error(JSON.stringify({ expected: expectedOutput, actual }, null, 2));
}

console.log(JSON.stringify(actual, null, 2));
