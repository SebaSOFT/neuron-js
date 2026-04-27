import type { Neuron } from "../index.js";
import type { ConditionInterface } from "../interfaces/Condition.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";

export class ConditionRuntime {
  constructor(
    readonly _conditions: ConditionInterface[],
    readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    return new ExecutionResult(true, context, true);
  }
}
