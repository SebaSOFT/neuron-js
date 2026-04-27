import type { Neuron } from "./index.js";
import type { ScriptInterface } from "./interfaces/Script.js";
import type { ExecutionContext } from "./types/ExecutionContext.js";
import { ExecutionResult } from "./types/ExecutionResult.js";

export class Synapse {
  constructor(private readonly _neuron: Neuron) {}

  execute(
    _script: ScriptInterface,
    context: ExecutionContext,
  ): ExecutionResult<number> {
    // Initial minimal implementation
    return new ExecutionResult(true, context, 0);
  }
}
