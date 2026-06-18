import type { ExecutionContext } from "../types/ExecutionContext.js";

export interface ValidationError {
  path: string;
  code: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

function ok(errors: ValidationError[]): ValidationResult {
  return { ok: errors.length === 0, errors };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function requireArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
): unknown[] | undefined {
  if (!Array.isArray(record[key])) {
    errors.push({
      path: `${path}.${key}`,
      code: "required_array",
      message: `Expected array at ${path}.${key}.`,
    });
    return undefined;
  }
  return record[key];
}

function validateOptions(
  record: Record<string, unknown>,
  path: string,
  errors: ValidationError[],
) {
  if (!("options" in record)) {
    errors.push({
      path: `${path}.options`,
      code: "required_object",
      message: `Expected options object at ${path}.options.`,
    });
    return;
  }

  if (!isRecord(record.options)) {
    errors.push({
      path: `${path}.options`,
      code: "invalid_type",
      message: `Expected object at ${path}.options, received ${typeName(record.options)}.`,
    });
  }
}

function validateElement(
  value: unknown,
  path: string,
  errors: ValidationError[],
): value is Record<string, unknown> {
  if (!requireRecord(value, path, errors)) return false;
  requireString(value, "id", path, errors);
  requireString(value, "type", path, errors);
  validateOptions(value, path, errors);
  return true;
}

function validateParameter(
  value: unknown,
  path: string,
  errors: ValidationError[],
) {
  if (!validateElement(value, path, errors)) return;
  requireString(value, "name", path, errors);
  if (!("value" in value)) {
    errors.push({
      path: `${path}.value`,
      code: "required_value",
      message: `Expected serializable value at ${path}.value.`,
    });
  }
}

function validateParamsOwner(
  value: Record<string, unknown>,
  path: string,
  errors: ValidationError[],
) {
  const params = requireArray(value, "params", path, errors);
  if (!params) return;
  params.forEach((param, index) => {
    validateParameter(param, `${path}.params[${index}]`, errors);
  });
}

function validateCondition(
  value: unknown,
  path: string,
  errors: ValidationError[],
) {
  if (!validateElement(value, path, errors)) return;
  validateParamsOwner(value, path, errors);
}

function validateAction(
  value: unknown,
  path: string,
  errors: ValidationError[],
) {
  if (!validateElement(value, path, errors)) return;
  validateParamsOwner(value, path, errors);
}

function validateRule(value: unknown, path: string, errors: ValidationError[]) {
  if (!validateElement(value, path, errors)) return;

  const conditions = requireArray(value, "conditions", path, errors);
  conditions?.forEach((condition, index) => {
    validateCondition(condition, `${path}.conditions[${index}]`, errors);
  });

  const actions = requireArray(value, "actions", path, errors);
  actions?.forEach((action, index) => {
    validateAction(action, `${path}.actions[${index}]`, errors);
  });
}

export function validateScript(script: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(script, "$", errors)) return ok(errors);
  requireString(script, "id", "$", errors);
  const rules = requireArray(script, "rules", "$", errors);
  rules?.forEach((rule, index) => {
    validateRule(rule, `$.rules[${index}]`, errors);
  });
  return ok(errors);
}

export function validateExecutionContext(context: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(context, "$", errors)) return ok(errors);

  const messages = requireArray(context, "messages", "$", errors);
  messages?.forEach((message, index) => {
    const path = `$.messages[${index}]`;
    if (!requireRecord(message, path, errors)) return;
    requireString(message, "type", path, errors);
    requireString(message, "text", path, errors);
  });

  if (!isRecord(context.state)) {
    errors.push({
      path: "$.state",
      code: "required_object",
      message: "Expected object at $.state.",
    });
  }

  return ok(errors);
}

export function validateExecutionOutput(output: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(output, "$", errors)) return ok(errors);

  if (typeof output.ok !== "boolean") {
    errors.push({
      path: "$.ok",
      code: "required_boolean",
      message: "Expected boolean at $.ok.",
    });
  }

  if (
    typeof output.rulesExecuted !== "number" &&
    output.rulesExecuted !== null
  ) {
    errors.push({
      path: "$.rulesExecuted",
      code: "required_number_or_null",
      message: "Expected number or null at $.rulesExecuted.",
    });
  }

  const messages = requireArray(output, "messages", "$", errors);
  messages?.forEach((message, index) => {
    if (typeof message !== "string") {
      errors.push({
        path: `$.messages[${index}]`,
        code: "required_string",
        message: `Expected string at $.messages[${index}].`,
      });
    }
  });

  return ok(errors);
}

export function validateValidationErrors(value: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!Array.isArray(value)) {
    errors.push({
      path: "$",
      code: "invalid_type",
      message: "Expected validation error array at $.",
    });
    return ok(errors);
  }

  value.forEach((item, index) => {
    const path = `$[${index}]`;
    if (!requireRecord(item, path, errors)) return;
    requireString(item, "path", path, errors);
    requireString(item, "code", path, errors);
    requireString(item, "message", path, errors);
  });

  return ok(errors);
}

export interface ExecutionExplanationEvent {
  step: number;
  type: string;
  message: string;
  ruleId?: string;
}

export interface ExecutionExplanation {
  scriptId: string;
  ok: boolean;
  rulesEvaluated: number;
  rulesExecuted: number | null;
  messages: string[];
  trace: ExecutionExplanationEvent[];
}

export function validateExecutionExplanation(value: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  if (!requireRecord(value, "$", errors)) return ok(errors);
  requireString(value, "scriptId", "$", errors);

  if (typeof value.ok !== "boolean") {
    errors.push({
      path: "$.ok",
      code: "required_boolean",
      message: "Expected boolean at $.ok.",
    });
  }
  if (typeof value.rulesEvaluated !== "number") {
    errors.push({
      path: "$.rulesEvaluated",
      code: "required_number",
      message: "Expected number at $.rulesEvaluated.",
    });
  }
  if (typeof value.rulesExecuted !== "number" && value.rulesExecuted !== null) {
    errors.push({
      path: "$.rulesExecuted",
      code: "required_number_or_null",
      message: "Expected number or null at $.rulesExecuted.",
    });
  }

  const messages = requireArray(value, "messages", "$", errors);
  messages?.forEach((message, index) => {
    if (typeof message !== "string") {
      errors.push({
        path: `$.messages[${index}]`,
        code: "required_string",
        message: `Expected string at $.messages[${index}].`,
      });
    }
  });

  const trace = requireArray(value, "trace", "$", errors);
  trace?.forEach((event, index) => {
    const path = `$.trace[${index}]`;
    if (!requireRecord(event, path, errors)) return;
    if (typeof event.step !== "number") {
      errors.push({
        path: `${path}.step`,
        code: "required_number",
        message: `Expected number at ${path}.step.`,
      });
    }
    requireString(event, "type", path, errors);
    requireString(event, "message", path, errors);
  });

  return ok(errors);
}

export function summarizeExecutionOutput(result: {
  isSuccessful(): boolean;
  value: unknown;
  messages: string[];
}) {
  return {
    ok: result.isSuccessful(),
    rulesExecuted: typeof result.value === "number" ? result.value : null,
    messages: result.messages,
  };
}

export type { ExecutionContext };
