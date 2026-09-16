import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  validateDecisionContext,
  validateDecisionDefinition,
  validateDecisionEvaluation,
  validateDecisionOutcome,
  validateDecisionReceipt,
  validateDecisionTestVector,
} from "../../src/index.js";
import type {
  DecisionDefinition,
  DecisionEvaluation,
  DecisionReceipt,
  DecisionTestVector,
} from "../../src/index.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(rootDir, path), "utf8"));
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

  test("invalid contexts fail validation before a caller can execute components", () => {
    let executed = false;
    const executionGate = validateDecisionContext(definition, { input: "not-a-number" });

    if (executionGate.ok) {
      executed = true;
    }

    expect(executionGate.ok).toBe(false);
    expect(executionGate.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "$.input",
          code: "schema_type",
        }),
      ]),
    );
    expect(executed).toBe(false);
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
