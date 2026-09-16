import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  AbstractAction,
  ExecutionResult,
  Neuron,
  runDecisionTestVectors,
} from "../../src/index.js";
import type {
  ActionOptions,
  DecisionDefinition,
  DecisionTestVector,
  ExecutionContext,
} from "../../src/index.js";

const fixtureDir = join(process.cwd(), "tests/fixtures/decision-vectors");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(fixtureDir, name), "utf8")) as T;
}

class VectorEmitOutcomeAction extends AbstractAction {
  static readonly TYPE = "vector_emit_outcome";

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

class VectorFailAction extends AbstractAction {
  static readonly TYPE = "vector_fail_action";

  execute(context: ExecutionContext): ExecutionResult<void> {
    return new ExecutionResult(false, context, null, ["vector fixture failure"]);
  }
}

function createApprovedVectorNeuron() {
  const neuron = new Neuron();
  neuron.registerAction(VectorEmitOutcomeAction.TYPE, VectorEmitOutcomeAction);
  neuron.registerAction(VectorFailAction.TYPE, VectorFailAction);
  return neuron;
}

function createChangedDefinition(
  definition: DecisionDefinition,
): DecisionDefinition {
  return {
    ...definition,
    version: "1.0.1",
    script: {
      ...definition.script,
      rules: definition.script.rules.map((rule) => ({
        ...rule,
        actions: rule.actions.map((action) => ({
          ...action,
          options: { outcome: { decision: "rejected" } },
        })),
      })),
    },
  };
}

describe("decision test-vector runner", () => {
  test("runs portable JSON fixtures for every decision status with approved local components", () => {
    const definitions = readJson<Record<string, DecisionDefinition>>("definitions.json");
    const vectors = readJson<DecisionTestVector[]>("portable-vectors.json");

    const report = runDecisionTestVectors({
      definitions,
      vectors,
      neuron: createApprovedVectorNeuron(),
    });

    expect(vectors.map((vector) => vector.expectedStatus)).toEqual([
      "succeeded",
      "invalid_context",
      "no_decision",
      "execution_failed",
    ]);
    expect(report.ok).toBe(true);
    expect(report.passed).toBe(4);
    expect(report.failed).toBe(0);
    expect(report.results).toHaveLength(4);
    expect(report.results.every((result) => result.passed)).toBe(true);
    expect(report.results.map((result) => result.receiptIdentity.status)).toEqual(
      vectors.map((vector) => vector.expectedStatus),
    );
  });

  test("reports reviewable expected-versus-actual drift with receipt identity", () => {
    const definitions = readJson<Record<string, DecisionDefinition>>("definitions.json");
    const vectors = readJson<DecisionTestVector[]>("portable-vectors.json");
    const changedDefinitions = {
      ...definitions,
      "approved-definition": createChangedDefinition(
        definitions["approved-definition"],
      ),
    };

    const report = runDecisionTestVectors({
      definitions: changedDefinitions,
      vectors: [vectors[0]],
      neuron: createApprovedVectorNeuron(),
    });

    expect(report.ok).toBe(false);
    expect(report.passed).toBe(0);
    expect(report.failed).toBe(1);
    expect(report.results).toEqual([
      expect.objectContaining({
        name: "successful outcome vector",
        passed: false,
        expected: {
          status: "succeeded",
          outcome: { decision: "accepted" },
        },
        actual: {
          status: "succeeded",
          outcome: { decision: "rejected" },
        },
      }),
    ]);
    expect(report.results[0].receiptIdentity).toMatchObject({
      decisionId: "portable-vector-decision",
      decisionVersion: "1.0.1",
      status: "succeeded",
    });
    expect(report.results[0].receiptIdentity.definitionHash).toMatch(
      /^sha256:[a-f0-9]{64}$/,
    );
    expect(report.results[0].receiptIdentity.contextHash).toMatch(
      /^sha256:[a-f0-9]{64}$/,
    );
    expect(report.results[0].receiptIdentity.registryManifestHash).toMatch(
      /^sha256:[a-f0-9]{64}$/,
    );
  });
});
