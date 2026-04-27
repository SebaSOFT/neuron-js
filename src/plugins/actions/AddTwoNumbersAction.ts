import type {
  ActionInterface,
  ActionOptions,
} from "../../interfaces/Action.js";
import type { ParameterInterface } from "../../interfaces/Parameter.js";
import { type ExecutionContext, MessageType } from "../../types/ExecutionContext.js";
import { ExecutionResult } from "../../types/ExecutionResult.js";
import { SimpleNumberParameter } from "../parameters/SimpleNumberParameter.js";

export class AddTwoNumbersAction {
  static readonly TYPE = "add_two_numbers";

  constructor(
    public readonly id: string,
    public readonly type: string,
    private readonly _params: ParameterInterface[],
    public readonly options: ActionOptions,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number | null> {
    const op1Param = this._params.find((p) => p.name === "op1");
    const op2Param = this._params.find((p) => p.name === "op2");

    if (!op1Param || !op2Param) {
      return new ExecutionResult<number | null>(false, context, null, [
        "Missing parameters",
      ]);
    }

    const op1 = new SimpleNumberParameter(
      op1Param.id,
      op1Param.type,
      op1Param.name,
      op1Param.value,
      op1Param.options,
    ).getValue(context);
    const op2 = new SimpleNumberParameter(
      op2Param.id,
      op2Param.type,
      op2Param.name,
      op2Param.value,
      op2Param.options,
    ).getValue(context);

    if (op1 === null || op2 === null) {
      return new ExecutionResult<number | null>(false, context, null, [
        "Invalid parameter values",
      ]);
    }

    const sum = op1 + op2;
    const updatedContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `Sum result: ${sum}` },
      ],
    };

    return new ExecutionResult(true, updatedContext, sum);
  }

  isSuccessful() {
    return true;
  }

  static fromJSON(jsonObject: ActionInterface): AddTwoNumbersAction {
    return new AddTwoNumbersAction(
      jsonObject.id,
      jsonObject.type,
      jsonObject.params,
      jsonObject.options,
    );
  }
}
