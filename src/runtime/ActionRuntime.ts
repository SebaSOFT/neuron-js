import type { Neuron } from "../index.js";
import type { ActionInterface } from "../interfaces/Action.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";

export class ActionRuntime {
  constructor(
    private readonly _actions: ActionInterface[],
    private readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    const messageList: string[] = [];
    let currentContext = context;
    let actionsExecuted = 0;

    for (const actionItem of this._actions) {
      if (actionItem.options.disabled) {
        continue;
      }

      const ActionCtor = this._neuron.getAction(actionItem.type);
      if (!ActionCtor) {
        messageList.push(`ERROR: Action type not found: ${actionItem.type}`);
        return new ExecutionResult(
          false,
          currentContext,
          actionsExecuted,
          messageList,
        );
      }

      const actionInstance = new ActionCtor(
        actionItem.id,
        actionItem.type,
        actionItem.params,
        actionItem.options,
      );

      const actionResult = actionInstance.execute(currentContext);
      messageList.push(...actionResult.messages);

      if (!actionResult.isSuccessful()) {
        return new ExecutionResult(
          false,
          currentContext,
          actionsExecuted,
          messageList,
        );
      }

      currentContext = actionResult.context;
      actionsExecuted++;
      messageList.push(`INFO: Action "${actionItem.id}" executed successfully`);
    }

    return new ExecutionResult(
      true,
      currentContext,
      actionsExecuted,
      messageList,
    );
  }
}
