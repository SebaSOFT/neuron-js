import type { ConditionOptions } from "../../interfaces/Condition.js";
import type { ParameterInterface } from "../../interfaces/Parameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";
import { ExecutionResult } from "../../types/ExecutionResult.js";
import { ComparatorParameter } from "../parameters/ComparatorParameter.js";
import { SimpleNumberParameter } from "../parameters/SimpleNumberParameter.js";

export class CompareTwoNumbersCondition {
  static readonly TYPE = "compare_two_numbers";

  constructor(
    public readonly id: string,
    public readonly type: string,
    private readonly _params: ParameterInterface[],
    public readonly options: ConditionOptions,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    const op1Param = this._params.find((p) => p.name === "op1");
    const compParam = this._params.find((p) => p.name === "comp");
    const op2Param = this._params.find((p) => p.name === "op2");

    if (!op1Param || !compParam || !op2Param) {
      return new ExecutionResult(false, context, false, ["Missing parameters"]);
    }

    const op1 = new SimpleNumberParameter(
      op1Param.id,
      op1Param.type,
      op1Param.name,
      op1Param.value,
      op1Param.options,
    ).getValue(context);
    const comp = new ComparatorParameter(
      compParam.id,
      compParam.type,
      compParam.name,
      compParam.value,
      compParam.options,
    ).getValue(context);
    const op2 = new SimpleNumberParameter(
      op2Param.id,
      op2Param.type,
      op2Param.name,
      op2Param.value,
      op2Param.options,
    ).getValue(context);

    if (op1 === null || comp === null || op2 === null) {
      return new ExecutionResult(false, context, false, [
        "Invalid parameter values",
      ]);
    }

    let result = false;
    switch (comp) {
      case "=":
        result = op1 === op2;
        break;
      case "!=":
        result = op1 !== op2;
        break;
      case ">":
        result = op1 > op2;
        break;
      case "<":
        result = op1 < op2;
        break;
      case ">=":
        result = op1 >= op2;
        break;
      case "<=":
        result = op1 <= op2;
        break;
    }

    return new ExecutionResult(true, context, result);
  }
}
