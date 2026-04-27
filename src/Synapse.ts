import type { Neuron } from "./index.js";
import { HookEvents } from "./interfaces/HookEvents.js";
import type { ScriptInterface } from "./interfaces/Script.js";
import { RuleRuntime } from "./runtime/RuleRuntime.js";
import type { ExecutionContext } from "./types/ExecutionContext.js";
import { ExecutionResult } from "./types/ExecutionResult.js";
import type { HookEmitter } from "./types/HookEmitter.js";

export class Synapse {
  constructor(
    private readonly _neuron: Neuron,
    private readonly _hookEmitter?: HookEmitter,
  ) {}

  execute(
    script: ScriptInterface,
    context: ExecutionContext,
    runtimeHookEmitter?: HookEmitter,
  ): ExecutionResult<number> {
    const emitter = runtimeHookEmitter ?? this._hookEmitter;

    if (!script?.rules || script.rules.length === 0) {
      emitter?.(HookEvents.ON_SCRIPT_START, context);
      const result = new ExecutionResult(true, context, 0, ["Empty script"]);
      emitter?.(HookEvents.ON_SCRIPT_END, context);
      return result;
    }

    emitter?.(HookEvents.ON_SCRIPT_START, context);
    const ruleRuntime = new RuleRuntime(script.rules, this._neuron, emitter);
    const result = ruleRuntime.execute(context);

    if (result.isSuccessful()) {
      emitter?.(HookEvents.ON_SCRIPT_END, result.context);
    } else {
      emitter?.(HookEvents.ON_SCRIPT_ERROR, result.context);
    }

    return result;
  }
}
