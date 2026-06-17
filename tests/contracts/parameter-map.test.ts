import { expect, test } from "vitest";
import { AbstractParameter, Neuron } from "../../src/index.js";
import type { ExecutionContext, ParameterInterface } from "../../src/index.js";

class ReadsNamedParameter extends AbstractParameter<string> {
  getValue(_context: ExecutionContext): string | null {
    return this.value;
  }
}

test("array parameter definitions can be transformed into a Map for plugin ergonomics", () => {
  const neuron = new Neuron();
  neuron.registerParameter("reader", ReadsNamedParameter as any);
  const params: ParameterInterface[] = [
    { id: "period", name: "period", type: "reader", value: "morning", options: {} },
  ];

  const paramMap = neuron.createParameterMap(params, { messages: [], state: {} });

  expect(paramMap).toBeInstanceOf(Map);
  expect(paramMap.get("period")?.getValue({ messages: [], state: {} })).toBe("morning");
});
