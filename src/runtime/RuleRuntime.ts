import type { Neuron } from "../index.js";
import type { RuleInterface } from "../interfaces/Rule.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";

export class RuleRuntime {
  constructor(
    readonly _rules: RuleInterface[],
    readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    return new ExecutionResult(true, context, 0);
  }
}
