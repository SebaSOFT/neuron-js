import { describe, expect, test } from "vitest";
import {
  AbstractAction,
  AbstractCondition,
  evaluateDecision,
  ExecutionResult,
  MessageType,
  Neuron,
} from "../../src/index.js";
import type {
  ActionOptions,
  DecisionDefinition,
  ExecutionContext,
} from "../../src/index.js";

const outcomeDefinition: DecisionDefinition = {
  id: "pure-evaluator-decision",
  version: "1.0.0",
  contextSchema: {
    type: "object",
    required: ["input"],
    properties: {
      input: { type: "number" },
    },
    additionalProperties: true,
  },
  outcomeSchema: {
    type: "object",
    required: ["decision"],
    properties: {
      decision: { type: "string", enum: ["accepted", "rejected"] },
    },
    additionalProperties: false,
  },
  components: {
    rules: ["simple_rule"],
    conditions: [],
    actions: ["fixture_outcome"],
    parameters: [],
  },
  script: {
    id: "pure-evaluator-script",
    rules: [
      {
        id: "emit-outcome-rule",
        type: "simple_rule",
        options: {},
        conditions: [],
        actions: [
          {
            id: "emit-outcome",
            type: "fixture_outcome",
            options: { outcome: { decision: "accepted" } } as ActionOptions,
            params: [],
          },
        ],
      },
    ],
  },
};

class FixtureOutcomeAction extends AbstractAction {
  static readonly TYPE = "fixture_outcome";

  execute(context: ExecutionContext): ExecutionResult<void> {
    return new ExecutionResult(true, {
      ...context,
      state: {
        ...context.state,
        outcome: (this.options as ActionOptions & { outcome?: unknown }).outcome,
      },
    });
  }
}

class FixtureFailingAction extends AbstractAction {
  static readonly TYPE = "fixture_failing_action";

  execute(context: ExecutionContext): ExecutionResult<void> {
    return new ExecutionResult(false, context, null, ["fixture failure"]);
  }
}

class FixtureFalseCondition extends AbstractCondition {
  static readonly TYPE = "fixture_false_condition";

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    return new ExecutionResult(true, context, false);
  }
}

class FixtureMutatingOutcomeAction extends AbstractAction {
  static readonly TYPE = "fixture_mutating_outcome";

  execute(context: ExecutionContext): ExecutionResult<void> {
    context.state.input = 999;
    context.messages.push({ type: MessageType.INFO, text: "internal mutation" });
    return new ExecutionResult(true, {
      ...context,
      state: { ...context.state, outcome: { decision: "accepted" } },
    });
  }
}

function createDecisionNeuron() {
  const neuron = new Neuron();
  neuron.registerAction(FixtureOutcomeAction.TYPE, FixtureOutcomeAction);
  neuron.registerAction(FixtureFailingAction.TYPE, FixtureFailingAction);
  neuron.registerAction(
    FixtureMutatingOutcomeAction.TYPE,
    FixtureMutatingOutcomeAction,
  );
  neuron.registerCondition(FixtureFalseCondition.TYPE, FixtureFalseCondition);
  return neuron;
}

function withScript(
  definition: DecisionDefinition,
  script: DecisionDefinition["script"],
  components: Partial<DecisionDefinition["components"]> = {},
): DecisionDefinition {
  return {
    ...definition,
    components: {
      ...definition.components,
      ...components,
    },
    script,
  };
}

describe("pure decision evaluator", () => {
  test("returns a succeeded evaluation with a schema-valid outcome", () => {
    const evaluation = evaluateDecision({
      definition: outcomeDefinition,
      context: { input: 7 },
      neuron: createDecisionNeuron(),
      correlation: { correlationId: "case-123" },
    });

    expect(evaluation.status).toBe("succeeded");
    expect(evaluation.outcome).toEqual({ decision: "accepted" });
    expect(evaluation.diagnostics).toEqual([]);
    expect(evaluation.receipt).toMatchObject({
      decisionId: outcomeDefinition.id,
      decisionVersion: outcomeDefinition.version,
      status: "succeeded",
      correlation: { correlationId: "case-123" },
    });
    expect(evaluation.receipt.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "execution_completed" }),
      ]),
    );
  });

  test("returns invalid_context before executing rule components", () => {
    const evaluation = evaluateDecision({
      definition: outcomeDefinition,
      context: { input: "not-a-number" },
      neuron: createDecisionNeuron(),
    });

    expect(evaluation.status).toBe("invalid_context");
    expect(evaluation.outcome).toBeUndefined();
    expect(evaluation.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "$.input", code: "schema_type" }),
      ]),
    );
    expect(evaluation.receipt.trace).toEqual([]);
  });

  test("returns no_decision when execution completes without an outcome", () => {
    const noDecisionDefinition = withScript(
      outcomeDefinition,
      {
        id: "no-decision-script",
        rules: [
          {
            id: "disabled-rule",
            type: "simple_rule",
            options: { disabled: true },
            conditions: [],
            actions: [
              {
                id: "skipped-outcome",
                type: "fixture_outcome",
                options: { outcome: { decision: "accepted" } } as ActionOptions,
                params: [],
              },
            ],
          },
        ],
      },
      { actions: ["fixture_outcome"] },
    );

    const evaluation = evaluateDecision({
      definition: noDecisionDefinition,
      context: { input: 7 },
      neuron: createDecisionNeuron(),
    });

    expect(evaluation.status).toBe("no_decision");
    expect(evaluation.outcome).toBeUndefined();
    expect(evaluation.diagnostics).toEqual([]);
  });

  test("returns execution_failed when runtime execution fails", () => {
    const failingDefinition = withScript(
      outcomeDefinition,
      {
        id: "failing-script",
        rules: [
          {
            id: "failing-rule",
            type: "simple_rule",
            options: {},
            conditions: [],
            actions: [
              {
                id: "failing-action",
                type: "fixture_failing_action",
                options: {},
                params: [],
              },
            ],
          },
        ],
      },
      { actions: ["fixture_failing_action"] },
    );

    const evaluation = evaluateDecision({
      definition: failingDefinition,
      context: { input: 7 },
      neuron: createDecisionNeuron(),
    });

    expect(evaluation.status).toBe("execution_failed");
    expect(evaluation.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "execution_failed" }),
      ]),
    );
  });

  test("rejects undeclared or unregistered component references before execution", () => {
    const undeclaredDefinition = withScript(
      outcomeDefinition,
      outcomeDefinition.script,
      { actions: [] },
    );
    const unregisteredDefinition = withScript(
      outcomeDefinition,
      outcomeDefinition.script,
      { actions: ["fixture_outcome"] },
    );
    const emptyNeuron = new Neuron();

    expect(
      evaluateDecision({
        definition: undeclaredDefinition,
        context: { input: 7 },
        neuron: createDecisionNeuron(),
      }),
    ).toMatchObject({
      status: "execution_failed",
      diagnostics: [
        expect.objectContaining({
          code: "component_not_declared",
          path: "$.script.rules[0].actions[0].type",
        }),
      ],
    });

    expect(
      evaluateDecision({
        definition: unregisteredDefinition,
        context: { input: 7 },
        neuron: emptyNeuron,
      }),
    ).toMatchObject({
      status: "execution_failed",
      diagnostics: [
        expect.objectContaining({
          code: "component_not_registered",
          path: "$.script.rules[0].actions[0].type",
        }),
      ],
    });
  });

  test("does not mutate the caller-supplied context snapshot", () => {
    const immutableDefinition = withScript(
      outcomeDefinition,
      {
        id: "immutable-context-script",
        rules: [
          {
            id: "mutating-rule",
            type: "simple_rule",
            options: {},
            conditions: [],
            actions: [
              {
                id: "mutating-action",
                type: "fixture_mutating_outcome",
                options: {},
                params: [],
              },
            ],
          },
        ],
      },
      { actions: ["fixture_mutating_outcome"] },
    );
    const callerContext = { input: 7, nested: { stable: true } };

    const evaluation = evaluateDecision({
      definition: immutableDefinition,
      context: callerContext,
      neuron: createDecisionNeuron(),
    });

    expect(evaluation.status).toBe("succeeded");
    expect(callerContext).toEqual({ input: 7, nested: { stable: true } });
  });

  test("returns execution_failed when the produced outcome violates the schema", () => {
    const malformedOutcomeDefinition = withScript(outcomeDefinition, {
      id: "malformed-outcome-script",
      rules: [
        {
          id: "malformed-outcome-rule",
          type: "simple_rule",
          options: {},
          conditions: [],
          actions: [
            {
              id: "emit-malformed-outcome",
              type: "fixture_outcome",
              options: { outcome: { decision: "maybe" } } as ActionOptions,
              params: [],
            },
          ],
        },
      ],
    });

    const evaluation = evaluateDecision({
      definition: malformedOutcomeDefinition,
      context: { input: 7 },
      neuron: createDecisionNeuron(),
    });

    expect(evaluation.status).toBe("execution_failed");
    expect(evaluation.outcome).toBeUndefined();
    expect(evaluation.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "$.outcome.decision", code: "schema_enum" }),
      ]),
    );
  });
});
