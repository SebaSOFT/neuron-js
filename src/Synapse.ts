import type { Neuron } from "./index.js";
import { HookEvents } from "./interfaces/HookEvents.js";
import type { ScriptInterface } from "./interfaces/Script.js";
import { RuleRuntime } from "./runtime/RuleRuntime.js";
import type { ExecutionContext } from "./types/ExecutionContext.js";
import { ExecutionResult } from "./types/ExecutionResult.js";
import type { HookEmitter } from "./types/HookEmitter.js";

/**
 * The Synapse class is the core execution engine of the rules system.
 * It processes logic defined in scripts by coordinating between the Registry (Neuron) and the state (ExecutionContext).
 */
export class Synapse {
  /**
   * Initializes a new execution engine.
   *
   * @param _neuron - The registry containing all element definitions.
   * @param _hookEmitter - Optional global lifecycle hook emitter.
   */
  constructor(
    private readonly _neuron: Neuron,
    private readonly _hookEmitter?: HookEmitter,
  ) {}

  /**
   * Executes a script logic against a provided context.
   *
   * @param script - The serializable script defining the logic rules.
   * @param context - The shared state object to pass through the execution.
   * @param runtimeHookEmitter - Optional one-time hook emitter for this specific execution.
   * @returns An ExecutionResult containing the final context and the number of successfully executed rules.
   */
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
