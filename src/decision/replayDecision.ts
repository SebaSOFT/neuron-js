import type { ValidationError } from "../contracts/validation.js";
import type { Neuron } from "../index.js";
import { canonicalDecisionHash } from "./canonical.js";
import type {
  DecisionComponentManifest,
  DecisionCorrelationMetadata,
  DecisionDefinition,
  DecisionEvaluation,
  DecisionReceipt,
  DecisionReplayRequest,
  JsonValue,
} from "./contracts.js";
import {
  DECISION_RUNTIME_VERSION,
  evaluateDecision,
} from "./evaluateDecision.js";

export interface ReplayDecisionOptions extends DecisionReplayRequest {
  neuron: Neuron;
  correlation?: DecisionCorrelationMetadata;
}

function hashDefinition(definition: DecisionDefinition): string {
  return canonicalDecisionHash(definition as unknown as JsonValue);
}

function hashManifest(manifest: DecisionComponentManifest): string {
  return canonicalDecisionHash(manifest as unknown as JsonValue);
}

function identityDiagnostics({
  definition,
  context,
  registryManifest,
  expectedReceipt,
}: DecisionReplayRequest): ValidationError[] {
  const checks: Array<{
    path: string;
    actual: string | undefined;
    expected: string | undefined;
  }> = [
    {
      path: "$.expectedReceipt.decisionId",
      actual: definition.id,
      expected: expectedReceipt.decisionId,
    },
    {
      path: "$.expectedReceipt.decisionVersion",
      actual: definition.version,
      expected: expectedReceipt.decisionVersion,
    },
    {
      path: "$.expectedReceipt.definitionHash",
      actual: hashDefinition(definition),
      expected: expectedReceipt.definitionHash,
    },
    {
      path: "$.expectedReceipt.contextHash",
      actual: canonicalDecisionHash(context),
      expected: expectedReceipt.contextHash,
    },
    {
      path: "$.expectedReceipt.registryManifestHash",
      actual: hashManifest(registryManifest),
      expected: expectedReceipt.registryManifestHash,
    },
    {
      path: "$.expectedReceipt.runtimeVersion",
      actual: DECISION_RUNTIME_VERSION,
      expected: expectedReceipt.runtimeVersion,
    },
  ];

  return checks
    .filter((check) => check.actual !== check.expected)
    .map((check) => ({
      path: check.path,
      code: "replay_identity_mismatch",
      message: `Expected retained replay artifact identity ${check.expected}, received ${check.actual}.`,
    }));
}

function createReplayFailureReceipt(
  definition: DecisionDefinition,
  context: JsonValue,
  registryManifest: DecisionComponentManifest,
  diagnostics: ValidationError[],
  correlation: DecisionCorrelationMetadata | undefined,
): DecisionReceipt {
  return {
    decisionId: definition.id,
    decisionVersion: definition.version,
    definitionHash: hashDefinition(definition),
    contextHash: canonicalDecisionHash(context),
    registryManifestHash: hashManifest(registryManifest),
    runtimeVersion: DECISION_RUNTIME_VERSION,
    status: "execution_failed",
    ...(correlation ? { correlation } : {}),
    diagnostics,
    trace: [],
  };
}

export function replayDecision({
  definition,
  context,
  registryManifest,
  expectedReceipt,
  neuron,
  correlation,
}: ReplayDecisionOptions): DecisionEvaluation {
  const replayDefinition = {
    ...definition,
    components: registryManifest,
  };
  const diagnostics = identityDiagnostics({
    definition: replayDefinition,
    context,
    registryManifest,
    expectedReceipt,
  });

  if (diagnostics.length > 0) {
    return {
      status: "execution_failed",
      diagnostics,
      receipt: createReplayFailureReceipt(
        replayDefinition,
        context,
        registryManifest,
        diagnostics,
        correlation,
      ),
    };
  }

  return evaluateDecision({
    definition: replayDefinition,
    context,
    neuron,
    correlation,
  });
}
