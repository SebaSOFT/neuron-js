import { expect, test } from "vitest";
import { Neuron } from "./index.js";

test("Neuron can be instantiated", () => {
  const neuron = new Neuron();
  expect(neuron).toBeDefined();
});

test("Neuron can register and retrieve types", () => {
  const neuron = new Neuron();
  class MockAction {}
  neuron.registerAction("mock_action", MockAction);
  expect(neuron.getAction("mock_action")).toBe(MockAction);
});
