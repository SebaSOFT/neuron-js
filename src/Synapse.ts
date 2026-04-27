import type { Neuron } from "./index.js";
import type { ScriptInterface } from "./interfaces/Script.js";
import { RuleRuntime } from "./runtime/RuleRuntime.js";
import type { ExecutionContext } from "./types/ExecutionContext.js";
import { ExecutionResult } from "./types/ExecutionResult.js";

export class Synapse {
  constructor(private readonly _neuron: Neuron) {}

  execute(
    script: ScriptInterface,
    context: ExecutionContext,
  ): ExecutionResult<number> {
    if (!script?.rules || script.rules.length === 0) {
      return new ExecutionResult(true, context, 0, ["Empty script"]);
    }

    const ruleRuntime = new RuleRuntime(script.rules, this._neuron);
    return ruleRuntime.execute(context);
  }
}
