import type { ActionOptions } from "../../interfaces/Action.js";
import type { ParameterInterface } from "../../interfaces/Parameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";
import { ExecutionResult } from "../../types/ExecutionResult.js";
import type { Neuron } from "../../index.js";

export class AddTwoNumbersAction {
  static readonly TYPE = "add_two_numbers";

  constructor(
    public readonly id: string,
    public readonly type: string,
    private readonly _params: ParameterInterface[],
    public readonly options: ActionOptions,
    private readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<number | null> {
    const op1Param = this._params.find((p) => p.name === "op1");
    const op2Param = this._params.find((p) => p.name === "op2");

    if (!op1Param || !op2Param) {
      return new ExecutionResult<number | null>(false, context, null, [
        "Missing parameters",
      ]);
    }

    const resolveParam = (p: ParameterInterface) => {
      const ParamCtor = this._neuron.getParameter(p.type);
      if (!ParamCtor) return null;
      return new ParamCtor(p.id, p.type, p.name, p.value, p.options).getValue(
        context,
      );
    };

    const op1 = resolveParam(op1Param);
    const op2 = resolveParam(op2Param);

    if (op1 === null || op2 === null) {
      return new ExecutionResult<number | null>(false, context, null, [
        "Invalid parameter values",
      ]);
    }

    const sum = (op1 as number) + (op2 as number);
    const updatedContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: "info" as any, text: `Sum result: ${sum}` },
      ],
    };

    return new ExecutionResult(true, updatedContext, sum);
  }

  isSuccessful() {
    return true;
  }
}
