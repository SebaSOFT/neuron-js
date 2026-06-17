import type { Neuron } from "../index.js";
import type { ActionInterface } from "../interfaces/Action.js";
import { HookEvents } from "../interfaces/HookEvents.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";
import type { HookEmitter } from "../types/HookEmitter.js";

export class ActionRuntime {
  constructor(
    private readonly _actions: ActionInterface[],
    private readonly _neuron: Neuron,
    private readonly _hookEmitter?: HookEmitter,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number> {
    const messageList: string[] = [];
    let currentContext = context;
    let actionsExecuted = 0;

    for (const actionItem of this._actions) {
      if (actionItem.options?.disabled) {
        continue;
      }

      this._hookEmitter?.(HookEvents.ON_ACTION_START, currentContext);

      const ActionCtor = this._neuron.getAction(actionItem.type);
      if (!ActionCtor) {
        messageList.push(`ERROR: Action type not found: ${actionItem.type}`);
        this._hookEmitter?.(HookEvents.ON_ACTION_ERROR, currentContext);
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
        this._neuron,
      );

      const actionResult = actionInstance.execute(currentContext);
      messageList.push(...actionResult.messages);

      if (!actionResult.isSuccessful()) {
        this._hookEmitter?.(HookEvents.ON_ACTION_ERROR, currentContext);
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
      this._hookEmitter?.(HookEvents.ON_ACTION_END, currentContext);
    }

    return new ExecutionResult(
      true,
      currentContext,
      actionsExecuted,
      messageList,
    );
  }
}
