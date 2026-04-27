import { expect, test } from "vitest";
import { Neuron } from "../index.js";
import { ConditionRuntime } from "./ConditionRuntime.js";

test("ConditionRuntime evaluates AND logic", () => {
  const neuron = new Neuron();
  class TrueCondition {
    constructor(_id: any, _type: any, _params: any, _options: any, _neuron: any) {}
    execute() {
      return {
        success: true,
        value: true,
        messages: [],
        isSuccessful() {
          return true;
        },
      };
    }
  }
  neuron.registerCondition("true_cond", TrueCondition as any);

  const conditions = [
    { id: "1", type: "true_cond", params: [], options: {} },
    { id: "2", type: "true_cond", params: [], options: {} },
  ];

  const runtime = new ConditionRuntime(conditions, neuron);
  const result = runtime.execute({ messages: [], state: {} });
  expect(result.value).toBe(true);
});

test("ConditionRuntime evaluates OR logic", () => {
  const neuron = new Neuron();
  class TrueCondition {
    constructor(_id: any, _type: any, _params: any, _options: any, _neuron: any) {}
    execute() {
      return {
        success: true,
        value: true,
        messages: [],
        isSuccessful() {
          return true;
        },
      };
    }
  }
  class FalseCondition {
    constructor(_id: any, _type: any, _params: any, _options: any, _neuron: any) {}
    execute() {
      return {
        success: true,
        value: false,
        messages: [],
        isSuccessful() {
          return true;
        },
      };
    }
  }
  neuron.registerCondition("true_cond", TrueCondition as any);
  neuron.registerCondition("false_cond", FalseCondition as any);

  const conditions = [
    { id: "1", type: "false_cond", params: [], options: {} },
    {
      id: "2",
      type: "true_cond",
      params: [],
      options: { orCondition: true },
    },
  ];

  const runtime = new ConditionRuntime(conditions, neuron);
  const result = runtime.execute({ messages: [], state: {} });
  expect(result.value).toBe(true);
});
