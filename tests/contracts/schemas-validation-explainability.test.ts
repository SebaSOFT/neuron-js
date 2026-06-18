import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  explainExecution,
  validateExecutionContext,
  validateExecutionExplanation,
  validateExecutionOutput,
  validateScript,
  validateValidationErrors,
} from "../../src/index.js";
import { ExecutionResult } from "../../src/index.js";
import type { ExecutionContext, ScriptInterface } from "../../src/index.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(rootDir, path), "utf8"));
}

describe("NJS-GROWTH-03 schema files", () => {
  test("ships JSON schemas for rules, execution IO, validation errors, and explanations", () => {
    const schemaFiles = [
      "schemas/script.schema.json",
      "schemas/execution-context.schema.json",
      "schemas/execution-output.schema.json",
      "schemas/validation-error.schema.json",
      "schemas/explanation-trace.schema.json",
    ];

    for (const schemaFile of schemaFiles) {
      const schema = readJson(schemaFile) as { $schema?: string; title?: string };
      expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
      expect(schema.title).toMatch(/^Neuron-JS /);
    }
  });
});

describe("NJS-GROWTH-03 validation contracts", () => {
  test("validates official example scripts and execution contexts", () => {
    const exampleDirs = [
      "examples/pricing-rules",
      "examples/eligibility-check",
      "examples/workflow-routing",
    ];

    for (const exampleDir of exampleDirs) {
      const script = readJson(`${exampleDir}/rules.json`);
      const context = readJson(`${exampleDir}/input.json`);

      expect(validateScript(script), exampleDir).toEqual({ ok: true, errors: [] });
      expect(validateExecutionContext(context), exampleDir).toEqual({
        ok: true,
        errors: [],
      });
    }
  });

  test("rejects invalid generated rules before runtime with path-level errors", () => {
    const invalidScript = {
      id: "generated-invalid",
      rules: [
        {
          id: "rule-without-actions",
          type: "simple_rule",
          options: {},
          conditions: [
            {
              id: "condition-missing-params",
              type: "compare_two_numbers",
              options: {},
            },
          ],
        },
      ],
    };

    const result = validateScript(invalidScript);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "$.rules[0].actions" }),
        expect.objectContaining({ path: "$.rules[0].conditions[0].params" }),
      ]),
    );
    expect(validateValidationErrors(result.errors)).toEqual({
      ok: true,
      errors: [],
    });
  });

  test("validates execution output summaries", () => {
    const output = {
      ok: true,
      rulesExecuted: 1,
      messages: ["Applied 16% discount: -20"],
    };

    expect(validateExecutionOutput(output)).toEqual({ ok: true, errors: [] });
  });
});

describe("NJS-GROWTH-03 explainability contracts", () => {
  test("creates stable explanation traces for official examples", () => {
    const script = readJson("examples/pricing-rules/rules.json") as ScriptInterface;
    const input = readJson("examples/pricing-rules/input.json") as ExecutionContext;
    const expected = readJson("examples/pricing-rules/expected-output.json") as {
      ok: boolean;
      rulesExecuted: number;
      messages: string[];
    };
    const result = new ExecutionResult(
      expected.ok,
      input,
      expected.rulesExecuted,
      expected.messages,
    );

    const explanation = explainExecution({ script, result });

    expect(validateExecutionExplanation(explanation)).toEqual({
      ok: true,
      errors: [],
    });
    expect(explanation).toMatchInlineSnapshot(`
      {
        "messages": [
          "Applied 16% discount: -20",
        ],
        "ok": true,
        "rulesEvaluated": 1,
        "rulesExecuted": 1,
        "scriptId": "pricing-rules-demo",
        "trace": [
          {
            "message": "Script pricing-rules-demo contains 1 rule(s).",
            "step": 1,
            "type": "script_received",
          },
          {
            "message": "Rule vip-order-discount has 1 condition(s) and 1 action(s).",
            "ruleId": "vip-order-discount",
            "step": 2,
            "type": "rule_available",
          },
          {
            "message": "Execution completed with 1 rule(s) executed.",
            "ruleId": "vip-order-discount",
            "step": 3,
            "type": "execution_completed",
          },
        ],
      }
    `);
  });
});
