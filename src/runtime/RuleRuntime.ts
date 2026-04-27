import type { Neuron } from "../index.js";
import type { RuleInterface } from "../interfaces/Rule.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";
import { ActionRuntime } from "./ActionRuntime.js";
import { ConditionRuntime } from "./ConditionRuntime.js";

export class RuleRuntime {
  constructor(
    private readonly _rules: RuleInterface[],
    private readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    const messageList: string[] = [];
    let currentContext = context;
    let rulesExecuted = 0;

    for (const ruleItem of this._rules) {
      if (ruleItem.options.disabled) {
        continue;
      }

      // 1. Evaluate Conditions
      const conditionRuntime = new ConditionRuntime(
        ruleItem.conditions,
        this._neuron,
      );
      const conditionResult = conditionRuntime.execute(currentContext);
      messageList.push(...conditionResult.messages);

      if (!conditionResult.isSuccessful()) {
        return new ExecutionResult(
          false,
          currentContext,
          rulesExecuted,
          messageList,
        );
      }

      // 2. If conditions pass, execute Actions
      if (conditionResult.value) {
        const actionRuntime = new ActionRuntime(ruleItem.actions, this._neuron);
        const actionResult = actionRuntime.execute(currentContext);
        messageList.push(...actionResult.messages);

        if (!actionResult.isSuccessful()) {
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
    }

    return new ExecutionResult(
      true,
      currentContext,
      rulesExecuted,
      messageList,
    );
  }
}
