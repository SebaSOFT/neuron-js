import type { Neuron } from "../index.js";
import type { ConditionInterface } from "../interfaces/Condition.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";

export class ConditionRuntime {
  constructor(
    private readonly _conditions: ConditionInterface[],
    private readonly _neuron: Neuron,
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
        return new ExecutionResult(false, context, false, messageList);
      }

      const verdict = conditionItem.options.inverted
        ? !conditionResult.value
        : !!conditionResult.value;

      orGroups[groupIndex].push(verdict);
    }

    const finalResult = orGroups.some(
      (group) => group.length > 0 && group.every((v) => v),
    );

    return new ExecutionResult(true, context, finalResult, messageList);
  }
}
