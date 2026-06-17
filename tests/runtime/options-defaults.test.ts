import { expect, test } from "vitest";
import { Neuron, Synapse } from "../../src/index.js";

test("scripts can omit rule action and condition options", () => {
  const synapse = new Synapse(new Neuron());
  const script = {
    id: "options-defaults",
    rules: [
      {
        id: "rule-without-options",
        type: "simple_rule",
        conditions: [
          {
            id: "condition-without-options",
            type: "compare_two_numbers",
            params: [
              { id: "p1", name: "op1", type: "simple_number", value: "2", options: {} },
              { id: "p2", name: "comp", type: "comparator", value: ">", options: {} },
              { id: "p3", name: "op2", type: "simple_number", value: "1", options: {} },
            ],
          },
        ],
        actions: [
          {
            id: "action-without-options",
            type: "add_two_numbers",
            params: [
              { id: "p4", name: "op1", type: "simple_number", value: "1", options: {} },
              { id: "p5", name: "op2", type: "simple_number", value: "2", options: {} },
            ],
          },
        ],
      },
    ],
  };

  const result = synapse.execute(script as any, { messages: [], state: {} });

  expect(result.isSuccessful()).toBe(true);
  expect(result.value).toBe(1);
});

test("rules with no actions and omitted options do nothing successfully", () => {
  const synapse = new Synapse(new Neuron());
  const script = {
    id: "do-nothing",
    rules: [{ id: "rule-without-actions", type: "simple_rule", conditions: [], actions: [] }],
  };

  const result = synapse.execute(script as any, { messages: [], state: {} });

  expect(result.isSuccessful()).toBe(true);
  expect(result.value).toBe(1);
});
