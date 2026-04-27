import type { Neuron } from "../index.js";
import type { ConditionInterface } from "../interfaces/Condition.js";
import { HookEvents } from "../interfaces/HookEvents.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";
import type { HookEmitter } from "../types/HookEmitter.js";

export class ConditionRuntime {
  constructor(
    private readonly _conditions: ConditionInterface[],
    private readonly _neuron: Neuron,
    private readonly _hookEmitter?: HookEmitter,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    if (this._conditions.length === 0) {
      return new ExecutionResult(true, context, true);
    }

    const messageList: string[] = [];
    const orGroups: boolean[][] = [[]];
    let groupIndex = 0;

    for (const conditionItem of this._conditions) {
      if (conditionItem.options.disabled) {
        continue;
      }

      this._hookEmitter?.(HookEvents.ON_CONDITION_START, context);

      if (
        conditionItem.options.orCondition &&
        orGroups[groupIndex].length > 0
      ) {
        groupIndex++;
        orGroups[groupIndex] = [];
      }

      const ConditionCtor = this._neuron.getCondition(conditionItem.type);
      if (!ConditionCtor) {
        messageList.push(
          `ERROR: Condition type not found: ${conditionItem.type}`,
        );
        this._hookEmitter?.(HookEvents.ON_CONDITION_ERROR, context);
        return new ExecutionResult(false, context, false, messageList);
      }

      const conditionInstance = new ConditionCtor(
        conditionItem.id,
        conditionItem.type,
        conditionItem.params,
        conditionItem.options,
        this._neuron,
      );

      const conditionResult = conditionInstance.execute(context);
      messageList.push(...conditionResult.messages);

      if (!conditionResult.isSuccessful()) {
        this._hookEmitter?.(HookEvents.ON_CONDITION_ERROR, context);
        return new ExecutionResult(false, context, false, messageList);
      }

      const verdict = conditionItem.options.inverted
        ? !conditionResult.value
        : !!conditionResult.value;

      orGroups[groupIndex].push(verdict);
      this._hookEmitter?.(HookEvents.ON_CONDITION_END, context);
    }

    const finalResult = orGroups.some(
      (group) => group.length > 0 && group.every((v) => v),
    );

    return new ExecutionResult(true, context, finalResult, messageList);
  }
}
