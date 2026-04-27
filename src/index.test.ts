import { expect, test } from "vitest";
import { Neuron } from "./index.js";
import { Synapse } from "./Synapse.js";

test("Neuron can be instantiated with default plugins", () => {
  const neuron = new Neuron();
  expect(neuron.getAction("add_two_numbers")).toBeDefined();
  expect(neuron.getCondition("compare_two_numbers")).toBeDefined();
});

test("E2E: Synapse can execute a script with conditions and actions", () => {
  const neuron = new Neuron();
  const synapse = new Synapse(neuron);

  const script = {
    id: "test-script",
    rules: [
      {
        id: "rule-1",
        type: "simple_rule",
        options: {},
        conditions: [
          {
            id: "cond-1",
            type: "compare_two_numbers",
            options: {},
            params: [
              {
                id: "p1",
                name: "op1",
                type: "simple_number",
                value: "10",
                options: {},
              },
              {
                id: "p2",
                name: "comp",
                type: "comparator",
                value: ">",
                options: {},
              },
              {
                id: "p3",
                name: "op2",
                type: "simple_number",
                value: "5",
                options: {},
              },
            ],
          },
        ],
        actions: [
          {
            id: "act-1",
            type: "add_two_numbers",
            options: {},
            params: [
              {
                id: "p4",
                name: "op1",
                type: "simple_number",
                value: "1",
                options: {},
              },
              {
                id: "p5",
                name: "op2",
                type: "simple_number",
                value: "2",
                options: {},
              },
            ],
          },
        ],
      },
    ],
  };

  const context = { messages: [], state: {} };
  const result = synapse.execute(script as any, context);

  expect(result.isSuccessful()).toBe(true);
  expect(result.value).toBe(1); // 1 rule executed
  expect(
    result.context.messages.some((m) => m.text.includes("Sum result: 3")),
  ).toBe(true);
});
