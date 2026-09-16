import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import {
  AbstractAction,
  AbstractCondition,
  AbstractElement,
  AbstractParameter,
  AbstractRule,
  AddTwoNumbersAction,
  ComparatorParameter,
  CompareTwoNumbersCondition,
  ExecutionResult,
  HookEvents,
  Neuron,
  validateDecisionContext,
  validateDecisionDefinition,
  validateDecisionEvaluation,
  validateDecisionOutcome,
  validateDecisionReceipt,
  validateDecisionTestVector,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateExecutionExplanation,
  validateExecutionOutput,
  validateScript,
  validateValidationErrors,
  SimpleNumberParameter,
  SimpleRule,
  SimpleSelectParameter,
  SimpleStringParameter,
  Synapse,
} from "../../src/index.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("package root exports the supported public API", () => {
  expect(Neuron).toBeDefined();
  expect(Synapse).toBeDefined();
  expect(ExecutionResult).toBeDefined();
  expect(HookEvents).toBeDefined();
  expect(validateScript).toBeDefined();
  expect(validateDecisionDefinition).toBeDefined();
  expect(validateDecisionContext).toBeDefined();
  expect(validateDecisionOutcome).toBeDefined();
  expect(validateDecisionEvaluation).toBeDefined();
  expect(validateDecisionReceipt).toBeDefined();
  expect(validateDecisionTestVector).toBeDefined();
  expect(validateExecutionContext).toBeDefined();
  expect(validateExecutionOutput).toBeDefined();
  expect(validateValidationErrors).toBeDefined();
  expect(validateExecutionExplanation).toBeDefined();
  expect(summarizeExecutionOutput).toBeDefined();
  expect(explainExecution).toBeDefined();
  expect(AbstractAction).toBeDefined();
  expect(AbstractCondition).toBeDefined();
  expect(AbstractElement).toBeDefined();
  expect(AbstractParameter).toBeDefined();
  expect(AbstractRule).toBeDefined();
  expect(AddTwoNumbersAction.TYPE).toBe("add_two_numbers");
  expect(CompareTwoNumbersCondition.TYPE).toBe("compare_two_numbers");
  expect(ComparatorParameter.TYPE).toBe("comparator");
  expect(SimpleNumberParameter.TYPE).toBe("simple_number");
  expect(SimpleStringParameter.TYPE).toBe("simple_string");
  expect(SimpleSelectParameter.TYPE).toBe("simple_select");
  expect(SimpleRule.TYPE).toBe("simple_rule");
});

test("built package root can be consumed using documented imports", async () => {
  const publicApi = await import("../../src/index.js");
  expect(publicApi.Neuron).toBeDefined();
  expect(publicApi.Synapse).toBeDefined();
  expect(publicApi.validateDecisionDefinition).toBeDefined();
});

test("package root export contract keeps ESM and CommonJS surfaces on the root import", () => {
  const packageJson = JSON.parse(
    readFileSync(join(rootDir, "package.json"), "utf8"),
  ) as {
    exports: Record<
      string,
      {
        import: { types: string; default: string };
        require: { types: string; default: string };
      }
    >;
  };

  expect(Object.keys(packageJson.exports)).toEqual(["."]);
  expect(packageJson.exports["."].import).toEqual({
    types: "./dist/esm/index.d.ts",
    default: "./dist/esm/index.js",
  });
  expect(packageJson.exports["."].require).toEqual({
    types: "./dist/commonjs/index.d.ts",
    default: "./dist/commonjs/index.js",
  });
});
