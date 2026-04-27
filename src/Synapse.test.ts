import { expect, test } from "vitest";
import { Neuron } from "./index.js";
import { Synapse } from "./Synapse.js";

test("Synapse can execute an empty script", () => {
  const neuron = new Neuron();
  const synapse = new Synapse(neuron);
  const context = { messages: [], state: {} };
  const script = { id: "test", rules: [] };

  const result = synapse.execute(script, context);
  expect(result.isSuccessful()).toBe(true);
  expect(result.value).toBe(0);
});
