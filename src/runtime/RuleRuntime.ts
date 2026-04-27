import type { Neuron } from "../index.js";
import { HookEvents } from "../interfaces/HookEvents.js";
import type { RuleInterface } from "../interfaces/Rule.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";
import type { HookEmitter } from "../types/HookEmitter.js";
import { ActionRuntime } from "./ActionRuntime.js";
import { ConditionRuntime } from "./ConditionRuntime.js";

export class RuleRuntime {
  constructor(
    private readonly _rules: RuleInterface[],
    private readonly _neuron: Neuron,
    private readonly _hookEmitter?: HookEmitter,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    const messageList: string[] = [];
    let currentContext = context;
    let rulesExecuted = 0;

    for (const ruleItem of this._rules) {
      if (ruleItem.options.disabled) {
        continue;
      }

      this._hookEmitter?.(HookEvents.ON_RULE_START, currentContext);

      // 1. Evaluate Conditions
      const conditionRuntime = new ConditionRuntime(
        ruleItem.conditions,
        this._neuron,
        this._hookEmitter,
      );
      const conditionResult = conditionRuntime.execute(currentContext);
      messageList.push(...conditionResult.messages);

      if (!conditionResult.isSuccessful()) {
        this._hookEmitter?.(HookEvents.ON_RULE_ERROR, currentContext);
        return new ExecutionResult(
          false,
          currentContext,
          rulesExecuted,
          messageList,
        );
      }

      // 2. If conditions pass, execute Actions
      if (conditionResult.value) {
        const actionRuntime = new ActionRuntime(
          ruleItem.actions,
          this._neuron,
          this._hookEmitter,
        );
        const actionResult = actionRuntime.execute(currentContext);
        messageList.push(...actionResult.messages);

        if (!actionResult.isSuccessful()) {
          this._hookEmitter?.(HookEvents.ON_RULE_ERROR, currentContext);
          return new ExecutionResult(
            false,
            currentContext,
            rulesExecuted,
            messageList,
          );
        }

        currentContext = actionResult.context;
        rulesExecuted++;
        messageList.push(
          `INFO: Rule "${ruleItem.id}" conditions met and actions executed`,
        );
      }

      this._hookEmitter?.(HookEvents.ON_RULE_END, currentContext);
    }

    return new ExecutionResult(
      true,
      currentContext,
      rulesExecuted,
      messageList,
    );
  }
}
