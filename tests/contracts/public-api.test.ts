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
  SimpleNumberParameter,
  SimpleRule,
  SimpleSelectParameter,
  SimpleStringParameter,
  Synapse,
} from "../../src/index.js";

test("package root exports the supported public API", () => {
  expect(Neuron).toBeDefined();
  expect(Synapse).toBeDefined();
  expect(ExecutionResult).toBeDefined();
  expect(HookEvents).toBeDefined();
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
});
