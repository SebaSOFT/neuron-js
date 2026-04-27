import { expect, test } from "vitest";
import { Neuron } from "./index.js";

test("Neuron can be instantiated", () => {
  const neuron = new Neuron();
  expect(neuron).toBeDefined();
});
