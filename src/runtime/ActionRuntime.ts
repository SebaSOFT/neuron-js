import type { Neuron } from "../index.js";
import type { ActionInterface } from "../interfaces/Action.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";

export class ActionRuntime {
  constructor(
    readonly _actions: ActionInterface[],
    readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    return new ExecutionResult(true, context, 0);
  }
}
