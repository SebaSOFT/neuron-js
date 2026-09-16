import { explainExecution } from "../contracts/explain.js";
import type { ValidationError } from "../contracts/validation.js";
import { summarizeExecutionOutput } from "../contracts/validation.js";
import type { Neuron } from "../index.js";
import { Synapse } from "../Synapse.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { canonicalDecisionHash } from "./canonical.js";
import type {
  DecisionComponentManifest,
  DecisionCorrelationMetadata,
  DecisionDefinition,
  DecisionEvaluation,
  DecisionReceipt,
  DecisionStatus,
  JsonValue,
} from "./contracts.js";
import {
  validateDecisionContext,
  validateDecisionDefinition,
  validateDecisionOutcome,
} from "./validation.js";

export const DECISION_RUNTIME_VERSION = "0.5.2";
const OUTCOME_STATE_KEY = "outcome";

export interface EvaluateDecisionOptions {
  definition: DecisionDefinition;
  context: JsonValue;
  neuron: Neuron;
  correlation?: DecisionCorrelationMetadata;
}

type ComponentKind = keyof DecisionComponentManifest;

type ComponentReference = {
  kind: ComponentKind;
  type: string;
  path: string;
};

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function hashCanonicalContext(context: JsonValue): string | undefined {
  try {
    return canonicalDecisionHash(context);
  } catch (error) {
    if (error instanceof TypeError) {
      return undefined;
    }

    throw error;
  }
}

function createReceipt(
  definition: DecisionDefinition,
  context: JsonValue,
  status: DecisionStatus,
  correlation: DecisionCorrelationMetadata | undefined,
  trace: DecisionReceipt["trace"],
  diagnostics: ValidationError[],
): DecisionReceipt {
  const contextHash = hashCanonicalContext(context);

  return {
    decisionId: definition.id,
    decisionVersion: definition.version,
    definitionHash: canonicalDecisionHash(definition as unknown as JsonValue),
    ...(contextHash ? { contextHash } : {}),
    registryManifestHash: canonicalDecisionHash(
      definition.components as unknown as JsonValue,
    ),
    runtimeVersion: DECISION_RUNTIME_VERSION,
    status,
    ...(correlation ? { correlation } : {}),
    ...(diagnostics.length > 0 ? { diagnostics } : {}),
    trace,
  };
}

function createEvaluation(
  definition: DecisionDefinition,
  context: JsonValue,
  status: DecisionStatus,
  diagnostics: ValidationError[],
  correlation: DecisionCorrelationMetadata | undefined,
  trace: DecisionReceipt["trace"] = [],
  outcome?: JsonValue,
): DecisionEvaluation {
  return {
    status,
    ...(outcome !== undefined ? { outcome } : {}),
    diagnostics,
    receipt: createReceipt(
      definition,
      context,
      status,
      correlation,
      trace,
      diagnostics,
    ),
  };
}

function componentLookup(neuron: Neuron, kind: ComponentKind, type: string) {
  switch (kind) {
    case "rules":
      return neuron.getRule(type);
    case "conditions":
      return neuron.getCondition(type);
    case "actions":
      return neuron.getAction(type);
    case "parameters":
      return neuron.getParameter(type);
  }
}

function collectComponentReferences(
  definition: DecisionDefinition,
): ComponentReference[] {
  const references: ComponentReference[] = [];

  definition.script.rules.forEach((rule, ruleIndex) => {
    references.push({
      kind: "rules",
      type: rule.type,
      path: `$.script.rules[${ruleIndex}].type`,
    });

    rule.conditions.forEach((condition, conditionIndex) => {
      const conditionPath = `$.script.rules[${ruleIndex}].conditions[${conditionIndex}]`;
      references.push({
        kind: "conditions",
        type: condition.type,
        path: `${conditionPath}.type`,
      });
      condition.params.forEach((parameter, parameterIndex) => {
        references.push({
          kind: "parameters",
          type: parameter.type,
          path: `${conditionPath}.params[${parameterIndex}].type`,
        });
      });
    });

    rule.actions.forEach((action, actionIndex) => {
      const actionPath = `$.script.rules[${ruleIndex}].actions[${actionIndex}]`;
      references.push({
        kind: "actions",
        type: action.type,
        path: `${actionPath}.type`,
      });
      action.params.forEach((parameter, parameterIndex) => {
        references.push({
          kind: "parameters",
          type: parameter.type,
          path: `${actionPath}.params[${parameterIndex}].type`,
        });
      });
    });
  });

  return references;
}

function validateManifestReferences(
  definition: DecisionDefinition,
  neuron: Neuron,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const reference of collectComponentReferences(definition)) {
    if (!definition.components[reference.kind].includes(reference.type)) {
      errors.push({
        path: reference.path,
        code: "component_not_declared",
        message: `Component type ${reference.type} is not declared in decision manifest ${reference.kind}.`,
      });
      continue;
    }

    if (!componentLookup(neuron, reference.kind, reference.type)) {
      errors.push({
        path: reference.path,
        code: "component_not_registered",
        message: `Component type ${reference.type} is not registered for decision execution ${reference.kind}.`,
      });
    }
  }

  return errors;
}

function toExecutionDiagnostics(messages: string[]): ValidationError[] {
  return messages.map((message, index) => ({
    path: `$.execution.messages[${index}]`,
    code: "execution_failed",
    message,
  }));
}

function toThrownExecutionDiagnostic(error: unknown): ValidationError {
  return {
    path: "$.execution.exception",
    code: "execution_failed",
    message: error instanceof Error ? error.message : String(error),
  };
}

export function evaluateDecision({
  definition,
  context,
  neuron,
  correlation,
}: EvaluateDecisionOptions): DecisionEvaluation {
  const definitionValidation = validateDecisionDefinition(definition);
  if (!definitionValidation.ok) {
    return createEvaluation(
      definition,
      context,
      "execution_failed",
      definitionValidation.errors,
      correlation,
    );
  }

  const contextValidation = validateDecisionContext(definition, context);
  if (!contextValidation.ok) {
    return createEvaluation(
      definition,
      context,
      "invalid_context",
      contextValidation.errors,
      correlation,
    );
  }

  const manifestDiagnostics = validateManifestReferences(definition, neuron);
  if (manifestDiagnostics.length > 0) {
    return createEvaluation(
      definition,
      context,
      "execution_failed",
      manifestDiagnostics,
      correlation,
    );
  }

  const executionContext: ExecutionContext = {
    messages: [],
    state: cloneJson(context) as Record<string, unknown>,
  };
  let result: ReturnType<Synapse["execute"]>;
  try {
    const synapse = new Synapse(neuron);
    result = synapse.execute(definition.script, executionContext);
  } catch (error) {
    return createEvaluation(
      definition,
      context,
      "execution_failed",
      [toThrownExecutionDiagnostic(error)],
      correlation,
    );
  }
  const explanation = explainExecution({ script: definition.script, result });
  const output = summarizeExecutionOutput(result);

  if (!result.isSuccessful()) {
    return createEvaluation(
      definition,
      context,
      "execution_failed",
      toExecutionDiagnostics(output.messages),
      correlation,
      explanation.trace,
    );
  }

  if (!(OUTCOME_STATE_KEY in result.context.state)) {
    return createEvaluation(
      definition,
      context,
      "no_decision",
      [],
      correlation,
      explanation.trace,
    );
  }

  const outcome = result.context.state[OUTCOME_STATE_KEY] as JsonValue;
  const outcomeValidation = validateDecisionOutcome(definition, outcome);
  if (!outcomeValidation.ok) {
    return createEvaluation(
      definition,
      context,
      "execution_failed",
      outcomeValidation.errors.map((error) => ({
        ...error,
        path: `$.outcome${error.path.slice(1)}`,
      })),
      correlation,
      explanation.trace,
    );
  }

  return createEvaluation(
    definition,
    context,
    "succeeded",
    [],
    correlation,
    explanation.trace,
    cloneJson(outcome),
  );
}
