import type { Neuron } from "../index.js";
import { canonicalDecisionSerialize } from "./canonical.js";
import type {
  DecisionDefinition,
  DecisionEvaluation,
  DecisionReceipt,
  DecisionStatus,
  DecisionTestVector,
  JsonValue,
} from "./contracts.js";
import { evaluateDecision } from "./evaluateDecision.js";
import { validateDecisionTestVector } from "./validation.js";

export interface DecisionTestVectorExpectedValue {
  status: DecisionStatus;
  outcome?: JsonValue;
}

export interface DecisionTestVectorActualValue {
  status: DecisionStatus;
  outcome?: JsonValue;
}

export type DecisionTestVectorReceiptIdentity = Pick<
  DecisionReceipt,
  | "decisionId"
  | "decisionVersion"
  | "definitionHash"
  | "contextHash"
  | "registryManifestHash"
  | "runtimeVersion"
  | "status"
>;

export interface DecisionTestVectorResult {
  name: string;
  passed: boolean;
  expected: DecisionTestVectorExpectedValue;
  actual: DecisionTestVectorActualValue;
  receiptIdentity: DecisionTestVectorReceiptIdentity;
  diagnostics: DecisionEvaluation["diagnostics"];
}

export interface DecisionTestVectorReport {
  ok: boolean;
  passed: number;
  failed: number;
  results: DecisionTestVectorResult[];
}

export interface RunDecisionTestVectorsOptions {
  vectors: DecisionTestVector[];
  neuron: Neuron;
  definitions?: Record<string, DecisionDefinition>;
}

function resolveDefinition(
  vector: DecisionTestVector,
  definitions: Record<string, DecisionDefinition>,
): DecisionDefinition | undefined {
  if (vector.definition) return vector.definition;
  if (!vector.definitionRef) return undefined;
  return definitions[vector.definitionRef];
}

function receiptIdentity(
  receipt: DecisionReceipt,
): DecisionTestVectorReceiptIdentity {
  return {
    decisionId: receipt.decisionId,
    decisionVersion: receipt.decisionVersion,
    definitionHash: receipt.definitionHash,
    ...(receipt.contextHash ? { contextHash: receipt.contextHash } : {}),
    registryManifestHash: receipt.registryManifestHash,
    runtimeVersion: receipt.runtimeVersion,
    status: receipt.status,
  };
}

function expectedValue(
  vector: DecisionTestVector,
): DecisionTestVectorExpectedValue {
  return {
    status: vector.expectedStatus,
    ...(vector.expectedOutcome !== undefined
      ? { outcome: vector.expectedOutcome }
      : {}),
  };
}

function actualValue(
  evaluation: DecisionEvaluation,
): DecisionTestVectorActualValue {
  return {
    status: evaluation.status,
    ...(evaluation.outcome !== undefined
      ? { outcome: evaluation.outcome }
      : {}),
  };
}

function jsonValuesEqual(
  left: JsonValue | undefined,
  right: JsonValue | undefined,
) {
  if (left === undefined || right === undefined) return left === right;
  return canonicalDecisionSerialize(left) === canonicalDecisionSerialize(right);
}

function vectorPassed(
  vector: DecisionTestVector,
  evaluation: DecisionEvaluation,
): boolean {
  if (evaluation.status !== vector.expectedStatus) return false;
  if (vector.expectedStatus !== "succeeded") return true;
  return jsonValuesEqual(vector.expectedOutcome, evaluation.outcome);
}

function vectorWithResolvedDefinition(
  vector: DecisionTestVector,
  definition: DecisionDefinition,
): DecisionTestVector {
  return vector.definition
    ? vector
    : {
        ...vector,
        definition,
      };
}

export function runDecisionTestVectors({
  vectors,
  neuron,
  definitions = {},
}: RunDecisionTestVectorsOptions): DecisionTestVectorReport {
  const results = vectors.map((vector): DecisionTestVectorResult => {
    const definition = resolveDefinition(vector, definitions);

    if (!definition) {
      throw new Error(
        `Decision test vector ${vector.name} references unknown definition ${vector.definitionRef ?? "<missing>"}.`,
      );
    }

    const validation = validateDecisionTestVector(
      vectorWithResolvedDefinition(vector, definition),
    );
    if (!validation.ok) {
      throw new Error(
        `Decision test vector ${vector.name} is invalid: ${validation.errors
          .map((error) => `${error.path} ${error.code}`)
          .join(", ")}.`,
      );
    }

    const evaluation = evaluateDecision({
      definition,
      context: vector.context,
      neuron,
    });
    const passed = vectorPassed(vector, evaluation);

    return {
      name: vector.name,
      passed,
      expected: expectedValue(vector),
      actual: actualValue(evaluation),
      receiptIdentity: receiptIdentity(evaluation.receipt),
      diagnostics: evaluation.diagnostics,
    };
  });
  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  return {
    ok: failed === 0,
    passed,
    failed,
    results,
  };
}
