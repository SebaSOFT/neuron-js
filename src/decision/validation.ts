import type {
  ValidationError,
  ValidationResult,
} from "../contracts/validation.js";
import { validateScript } from "../contracts/validation.js";
import type {
  DecisionComponentManifest,
  DecisionDefinition,
  DecisionStatus,
  JsonSchema,
  JsonSchemaTypeName,
} from "./contracts.js";

const DECISION_STATUSES: DecisionStatus[] = [
  "succeeded",
  "invalid_context",
  "no_decision",
  "execution_failed",
];

function result(errors: ValidationError[]): ValidationResult {
  return { ok: errors.length === 0, errors };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function jsonEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function typeName(value: unknown): string {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function requireRecord(
  value: unknown,
  path: string,
  errors: ValidationError[],
): value is Record<string, unknown> {
  if (!isRecord(value)) {
    errors.push({
      path,
      code: "invalid_type",
      message: `Expected object at ${path}, received ${typeName(value)}.`,
    });
    return false;
  }
  return true;
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
) {
  if (typeof record[key] !== "string" || record[key] === "") {
    errors.push({
      path: `${path}.${key}`,
      code: "required_string",
      message: `Expected non-empty string at ${path}.${key}.`,
    });
  }
}

function requireArrayOfStrings(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
) {
  const value = record[key];
  if (!Array.isArray(value)) {
    errors.push({
      path: `${path}.${key}`,
      code: "required_string_array",
      message: `Expected string array at ${path}.${key}.`,
    });
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== "string" || item === "") {
      errors.push({
        path: `${path}.${key}[${index}]`,
        code: "required_string",
        message: `Expected non-empty string at ${path}.${key}[${index}].`,
      });
    }
  });
}

function validateStatus(
  value: unknown,
  path: string,
  errors: ValidationError[],
) {
  if (!DECISION_STATUSES.includes(value as DecisionStatus)) {
    errors.push({
      path,
      code: "invalid_decision_status",
      message: `Expected decision status at ${path}.`,
    });
  }
}

function validateManifest(
  manifest: unknown,
  path: string,
  errors: ValidationError[],
): manifest is DecisionComponentManifest {
  if (!requireRecord(manifest, path, errors)) return false;
  requireArrayOfStrings(manifest, "rules", path, errors);
  requireArrayOfStrings(manifest, "conditions", path, errors);
  requireArrayOfStrings(manifest, "actions", path, errors);
  requireArrayOfStrings(manifest, "parameters", path, errors);
  return true;
}

function schemaMatchesType(value: unknown, type: JsonSchemaTypeName): boolean {
  switch (type) {
    case "array":
      return Array.isArray(value);
    case "boolean":
      return typeof value === "boolean";
    case "integer":
      return Number.isInteger(value);
    case "null":
      return value === null;
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "object":
      return isRecord(value);
    case "string":
      return typeof value === "string";
  }
}

function validateAgainstSchema(
  schema: JsonSchema,
  value: unknown,
  path: string,
  errors: ValidationError[],
) {
  if (schema.const !== undefined && !jsonEqual(value, schema.const)) {
    errors.push({
      path,
      code: "schema_const",
      message: `Expected const value at ${path}.`,
    });
  }

  if (schema.enum && !schema.enum.some((entry) => jsonEqual(entry, value))) {
    errors.push({
      path,
      code: "schema_enum",
      message: `Expected one of the allowed enum values at ${path}.`,
    });
  }

  if (schema.type) {
    const expectedTypes = Array.isArray(schema.type)
      ? schema.type
      : [schema.type];
    if (
      !expectedTypes.some((expectedType) =>
        schemaMatchesType(value, expectedType),
      )
    ) {
      errors.push({
        path,
        code: "schema_type",
        message: `Expected ${expectedTypes.join(" or ")} at ${path}, received ${typeName(value)}.`,
      });
      return;
    }
  }

  if (schema.type === "object" || schema.properties || schema.required) {
    if (!isRecord(value)) return;

    for (const requiredKey of schema.required ?? []) {
      if (!(requiredKey in value)) {
        errors.push({
          path: `${path}.${requiredKey}`,
          code: "schema_required",
          message: `Expected required property ${path}.${requiredKey}.`,
        });
      }
    }

    for (const [key, propertySchema] of Object.entries(
      schema.properties ?? {},
    )) {
      if (key in value) {
        validateAgainstSchema(
          propertySchema,
          value[key],
          `${path}.${key}`,
          errors,
        );
      }
    }

    if (schema.additionalProperties === false && schema.properties) {
      for (const key of Object.keys(value)) {
        if (!(key in schema.properties)) {
          errors.push({
            path: `${path}.${key}`,
            code: "schema_additional_property",
            message: `Unexpected property ${path}.${key}.`,
          });
        }
      }
    }
  }

  if (schema.type === "array" || schema.items) {
    if (!Array.isArray(value) || !schema.items) return;
    value.forEach((item, index) => {
      validateAgainstSchema(
        schema.items as JsonSchema,
        item,
        `${path}[${index}]`,
        errors,
      );
    });
  }
}

function validateSchemaContract(
  schema: unknown,
  path: string,
  errors: ValidationError[],
): schema is JsonSchema {
  if (!requireRecord(schema, path, errors)) return false;
  if ("type" in schema) {
    const type = schema.type;
    const types = Array.isArray(type) ? type : [type];
    for (const item of types) {
      if (
        ![
          "array",
          "boolean",
          "integer",
          "null",
          "number",
          "object",
          "string",
        ].includes(item as string)
      ) {
        errors.push({
          path: `${path}.type`,
          code: "invalid_schema_type",
          message: `Unsupported JSON schema type at ${path}.type.`,
        });
      }
    }
  }
  if ("required" in schema && !Array.isArray(schema.required)) {
    errors.push({
      path: `${path}.required`,
      code: "required_string_array",
      message: `Expected string array at ${path}.required.`,
    });
  }
  if ("properties" in schema && !isRecord(schema.properties)) {
    errors.push({
      path: `${path}.properties`,
      code: "required_object",
      message: `Expected object at ${path}.properties.`,
    });
  }
  return true;
}

export function validateDecisionDefinition(
  definition: unknown,
): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(definition, "$", errors)) return result(errors);

  requireString(definition, "id", "$", errors);
  requireString(definition, "version", "$", errors);
  validateSchemaContract(definition.contextSchema, "$.contextSchema", errors);
  validateSchemaContract(definition.outcomeSchema, "$.outcomeSchema", errors);
  validateManifest(definition.components, "$.components", errors);

  const scriptValidation = validateScript(definition.script);
  for (const error of scriptValidation.errors) {
    errors.push({ ...error, path: `$.script${error.path.slice(1)}` });
  }

  return result(errors);
}

export function validateDecisionContext(
  definition: DecisionDefinition,
  context: unknown,
): ValidationResult {
  const definitionValidation = validateDecisionDefinition(definition);
  if (!definitionValidation.ok) return definitionValidation;

  const errors: ValidationError[] = [];
  validateAgainstSchema(definition.contextSchema, context, "$", errors);
  return result(errors);
}

export function validateDecisionOutcome(
  definition: DecisionDefinition,
  outcome: unknown,
): ValidationResult {
  const definitionValidation = validateDecisionDefinition(definition);
  if (!definitionValidation.ok) return definitionValidation;

  const errors: ValidationError[] = [];
  validateAgainstSchema(definition.outcomeSchema, outcome, "$", errors);
  return result(errors);
}

export function validateDecisionReceipt(receipt: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(receipt, "$", errors)) return result(errors);

  requireString(receipt, "decisionId", "$", errors);
  requireString(receipt, "decisionVersion", "$", errors);
  requireString(receipt, "definitionHash", "$", errors);
  if ("contextHash" in receipt && typeof receipt.contextHash !== "string") {
    errors.push({
      path: "$.contextHash",
      code: "required_string",
      message: "Expected string at $.contextHash.",
    });
  }
  requireString(receipt, "registryManifestHash", "$", errors);
  requireString(receipt, "runtimeVersion", "$", errors);
  validateStatus(receipt.status, "$.status", errors);

  if (!Array.isArray(receipt.trace)) {
    errors.push({
      path: "$.trace",
      code: "required_array",
      message: "Expected array at $.trace.",
    });
  }

  return result(errors);
}

export function validateDecisionEvaluation(
  definition: DecisionDefinition,
  evaluation: unknown,
): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(evaluation, "$", errors)) return result(errors);

  validateStatus(evaluation.status, "$.status", errors);
  if (!Array.isArray(evaluation.diagnostics)) {
    errors.push({
      path: "$.diagnostics",
      code: "required_array",
      message: "Expected diagnostics array at $.diagnostics.",
    });
  }

  const receiptValidation = validateDecisionReceipt(evaluation.receipt);
  for (const error of receiptValidation.errors) {
    errors.push({ ...error, path: `$.receipt${error.path.slice(1)}` });
  }

  if (
    isRecord(evaluation.receipt) &&
    typeof evaluation.status === "string" &&
    evaluation.receipt.status !== evaluation.status
  ) {
    errors.push({
      path: "$.receipt.status",
      code: "receipt_status_mismatch",
      message: "Expected receipt status to match evaluation status.",
    });
  }

  if (evaluation.status === "succeeded") {
    if (!("outcome" in evaluation)) {
      errors.push({
        path: "$.outcome",
        code: "required_outcome",
        message: "Expected outcome for succeeded decision evaluation.",
      });
    } else {
      const outcomeValidation = validateDecisionOutcome(
        definition,
        evaluation.outcome,
      );
      for (const error of outcomeValidation.errors) {
        errors.push({ ...error, path: `$.outcome${error.path.slice(1)}` });
      }
    }
  }

  return result(errors);
}

export function validateDecisionTestVector(vector: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(vector, "$", errors)) return result(errors);

  requireString(vector, "name", "$", errors);
  validateStatus(vector.expectedStatus, "$.expectedStatus", errors);

  if (!("definition" in vector) && !("definitionRef" in vector)) {
    errors.push({
      path: "$.definition",
      code: "required_definition_or_ref",
      message: "Expected embedded definition or definitionRef.",
    });
  }

  if ("definitionRef" in vector && typeof vector.definitionRef !== "string") {
    errors.push({
      path: "$.definitionRef",
      code: "required_string",
      message: "Expected string at $.definitionRef.",
    });
  }

  if ("definition" in vector) {
    const definitionValidation = validateDecisionDefinition(vector.definition);
    for (const error of definitionValidation.errors) {
      errors.push({ ...error, path: `$.definition${error.path.slice(1)}` });
    }

    if (
      definitionValidation.ok &&
      "context" in vector &&
      vector.expectedStatus !== "invalid_context"
    ) {
      const contextValidation = validateDecisionContext(
        vector.definition as DecisionDefinition,
        vector.context,
      );
      for (const error of contextValidation.errors) {
        errors.push({ ...error, path: `$.context${error.path.slice(1)}` });
      }
    }

    if (
      definitionValidation.ok &&
      vector.expectedStatus === "succeeded" &&
      "expectedOutcome" in vector
    ) {
      const outcomeValidation = validateDecisionOutcome(
        vector.definition as DecisionDefinition,
        vector.expectedOutcome,
      );
      for (const error of outcomeValidation.errors) {
        errors.push({
          ...error,
          path: `$.expectedOutcome${error.path.slice(1)}`,
        });
      }
    }
  }

  if (!("context" in vector)) {
    errors.push({
      path: "$.context",
      code: "required_value",
      message: "Expected context snapshot at $.context.",
    });
  }

  if (vector.expectedStatus === "succeeded" && !("expectedOutcome" in vector)) {
    errors.push({
      path: "$.expectedOutcome",
      code: "required_expected_outcome",
      message: "Expected expectedOutcome when expectedStatus is succeeded.",
    });
  }

  return result(errors);
}
