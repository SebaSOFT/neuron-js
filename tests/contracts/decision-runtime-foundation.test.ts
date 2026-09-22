import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  AbstractAction,
  ExecutionResult,
  HookEvents,
  Neuron,
  Synapse,
  validateDecisionContext,
  validateDecisionDefinition,
  validateDecisionEvaluation,
  validateDecisionOutcome,
  validateDecisionReceipt,
  validateDecisionTestVector,
} from "../../src/index.js";
import type {
  ActionInterface,
  DecisionDefinition,
  DecisionEvaluation,
  DecisionReceipt,
  DecisionTestVector,
  ExecutionContext,
  HookEmitter,
  ScriptInterface,
} from "../../src/index.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(rootDir, path), "utf8"));
}

function schemaRejectsDecisionTestVector(schema: unknown, vector: unknown): boolean {
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) {
    throw new Error("Expected schema object");
  }

  const schemaRecord = schema as {
    anyOf?: Array<{ required?: string[] }>;
    if?: { properties?: { expectedStatus?: { const?: string } } };
    then?: { required?: string[] };
    properties?: { definitionRef?: { minLength?: number } };
  };
  const vectorRecord = vector as Record<string, unknown>;

  const hasDefinitionAlternative = schemaRecord.anyOf?.some((alternative) =>
    alternative.required?.every((key) => key in vectorRecord),
  );
  if (hasDefinitionAlternative === false) return true;

  if (
    typeof vectorRecord.definitionRef === "string" &&
    schemaRecord.properties?.definitionRef?.minLength !== undefined &&
    vectorRecord.definitionRef.length < schemaRecord.properties.definitionRef.minLength
  ) {
    return true;
  }

  if (
    schemaRecord.if?.properties?.expectedStatus?.const === "succeeded" &&
    vectorRecord.expectedStatus === "succeeded" &&
    schemaRecord.then?.required?.some((key) => !(key in vectorRecord))
  ) {
    return true;
  }

  return false;
}

const definition: DecisionDefinition = {
  id: "foundation-decision",
  version: "1.0.0",
  contextSchema: {
    type: "object",
    required: ["input"],
    properties: {
      input: { type: "number" },
    },
  },
  outcomeSchema: {
    type: "object",
    required: ["decision"],
    properties: {
      decision: { type: "string", enum: ["accepted", "rejected"] },
    },
  },
  components: {
    rules: ["simple_rule"],
    conditions: ["compare_two_numbers"],
    actions: ["decision_outcome"],
    parameters: ["simple_number"],
  },
  script: {
    id: "foundation-script",
    rules: [
      {
        id: "foundation-rule",
        type: "simple_rule",
        options: {},
        conditions: [],
        actions: [],
      },
    ],
  },
};

describe("decision-runtime public foundation", () => {
  test("ships JSON schemas for decision contracts in package and public docs", () => {
    const schemaFiles = [
      "decision-definition.schema.json",
      "decision-evaluation.schema.json",
      "decision-receipt.schema.json",
      "decision-test-vector.schema.json",
    ];

    for (const schemaFile of schemaFiles) {
      for (const base of ["schemas", "docs/public/schemas"]) {
        const schema = readJson(`${base}/${schemaFile}`) as {
          $schema?: string;
          title?: string;
        };
        expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
        expect(schema.title).toMatch(/^Neuron-JS Decision/);
      }
    }
  });

  test("decision test vector schemas reject missing definitions and missing succeeded outcomes", () => {
    const malformedVectors = [
      {
        name: "missing-definition",
        context: { input: 7 },
        expectedStatus: "invalid_context",
      },
      {
        name: "empty-definition-ref",
        definitionRef: "",
        context: { input: 7 },
        expectedStatus: "invalid_context",
      },
      {
        name: "missing-succeeded-outcome",
        definitionRef: "foundation-decision@1.0.0",
        context: { input: 7 },
        expectedStatus: "succeeded",
      },
    ];

    for (const base of ["schemas", "docs/public/schemas"]) {
      const schema = readJson(`${base}/decision-test-vector.schema.json`);
      for (const malformedVector of malformedVectors) {
        expect(schemaRejectsDecisionTestVector(schema, malformedVector)).toBe(true);
      }
    }
  });

  test("root package exports decision validators and contract types", () => {
    expect(validateDecisionDefinition).toBeDefined();
    expect(validateDecisionContext).toBeDefined();
    expect(validateDecisionOutcome).toBeDefined();
    expect(validateDecisionEvaluation).toBeDefined();
    expect(validateDecisionReceipt).toBeDefined();
    expect(validateDecisionTestVector).toBeDefined();
  });

  test("validates decision definition, context, outcome, receipt, and test vector contracts", () => {
    expect(validateDecisionDefinition(definition)).toEqual({ ok: true, errors: [] });
    expect(validateDecisionContext(definition, { input: 7 })).toEqual({
      ok: true,
      errors: [],
    });
    expect(validateDecisionOutcome(definition, { decision: "accepted" })).toEqual({
      ok: true,
      errors: [],
    });

    const receipt: DecisionReceipt = {
      decisionId: definition.id,
      decisionVersion: definition.version,
      definitionHash: "sha256:def",
      contextHash: "sha256:ctx",
      registryManifestHash: "sha256:manifest",
      runtimeVersion: "0.5.2",
      status: "succeeded",
      trace: [],
      correlation: { correlationId: "case-123" },
    };
    expect(validateDecisionReceipt(receipt)).toEqual({ ok: true, errors: [] });

    const vector: DecisionTestVector = {
      name: "accepts-positive-input",
      definition,
      context: { input: 7 },
      expectedStatus: "succeeded",
      expectedOutcome: { decision: "accepted" },
    };
    expect(validateDecisionTestVector(vector)).toEqual({ ok: true, errors: [] });

    const invalidContextVector: DecisionTestVector = {
      name: "rejects-malformed-input",
      definition,
      context: { input: "not-a-number" },
      expectedStatus: "invalid_context",
    };
    expect(validateDecisionTestVector(invalidContextVector)).toEqual({
      ok: true,
      errors: [],
    });
  });

  test("invalid contexts stop the executable runtime boundary before rule and action components run", () => {
    const spyActionExecutions: ExecutionContext[] = [];
    class SpyDecisionAction extends AbstractAction {
      static readonly TYPE = "spy_decision_action";

      execute(context: ExecutionContext): ExecutionResult<void> {
        spyActionExecutions.push(context);
        return new ExecutionResult(true, context);
      }
    }

    const neuron = new Neuron();
    neuron.registerAction(SpyDecisionAction.TYPE, SpyDecisionAction);
    const hookEvents: string[] = [];
    const hookEmitter: HookEmitter = (event) => hookEvents.push(event);
    const synapse = new Synapse(neuron, hookEmitter);
    const script: ScriptInterface = {
      id: "decision-boundary-script",
      rules: [
        {
          id: "decision-boundary-rule",
          type: "simple_rule",
          options: {},
          conditions: [],
          actions: [
            {
              id: "decision-boundary-action",
              type: SpyDecisionAction.TYPE,
              options: {},
              params: [],
            } satisfies ActionInterface,
          ],
        },
      ],
    };
    const executeDecisionScript = (context: ExecutionContext) => {
      const contextValidation = validateDecisionContext(definition, context.state);
      if (!contextValidation.ok) {
        return { status: "invalid_context", validation: contextValidation } as const;
      }

      return {
        status: "succeeded",
        result: synapse.execute(script, context),
      } as const;
    };

    const validResult = executeDecisionScript({ messages: [], state: { input: 7 } });
    expect(validResult.status).toBe("succeeded");
    expect(spyActionExecutions).toHaveLength(1);
    expect(hookEvents).toContain(HookEvents.ON_RULE_START);
    expect(hookEvents).toContain(HookEvents.ON_ACTION_START);

    spyActionExecutions.length = 0;
    hookEvents.length = 0;
    const invalidResult = executeDecisionScript({
      messages: [],
      state: { input: "not-a-number" },
    });

    expect(invalidResult.status).toBe("invalid_context");
    if (invalidResult.status !== "invalid_context") {
      throw new Error("Expected invalid context result");
    }
    expect(invalidResult.validation.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "$.input",
          code: "schema_type",
        }),
      ]),
    );
    expect(spyActionExecutions).toHaveLength(0);
    expect(hookEvents).not.toContain(HookEvents.ON_RULE_START);
    expect(hookEvents).not.toContain(HookEvents.ON_ACTION_START);
  });

  test("malformed outcomes cannot validate as a succeeded decision evaluation", () => {
    const evaluation: DecisionEvaluation = {
      status: "succeeded",
      outcome: { decision: "maybe" },
      diagnostics: [],
      receipt: {
        decisionId: definition.id,
        decisionVersion: definition.version,
        definitionHash: "sha256:def",
        contextHash: "sha256:ctx",
        registryManifestHash: "sha256:manifest",
        runtimeVersion: "0.5.2",
        status: "succeeded",
        trace: [],
      },
    };

    const result = validateDecisionEvaluation(definition, evaluation);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "$.outcome.decision",
          code: "schema_enum",
        }),
      ]),
    );
  });
});
