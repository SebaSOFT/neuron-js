import type {
  ConditionInterface,
  ConditionOptions,
} from "../../interfaces/Condition.js";
import type { ParameterInterface } from "../../interfaces/Parameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";
import { ExecutionResult } from "../../types/ExecutionResult.js";
import type { Neuron } from "../../index.js";

export class CompareTwoNumbersCondition {
  static readonly TYPE = "compare_two_numbers";

  constructor(
    public readonly id: string,
    public readonly type: string,
    private readonly _params: ParameterInterface[],
    public readonly options: ConditionOptions,
    private readonly _neuron: Neuron,
  ) {}

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    const op1Param = this._params.find((p) => p.name === "op1");
    const compParam = this._params.find((p) => p.name === "comp");
    const op2Param = this._params.find((p) => p.name === "op2");

    if (!op1Param || !compParam || !op2Param) {
      return new ExecutionResult(false, context, false, ["Missing parameters"]);
    }

    const resolveParam = (p: ParameterInterface) => {
      const ParamCtor = this._neuron.getParameter(p.type);
      if (!ParamCtor) return null;
      return new ParamCtor(p.id, p.type, p.name, p.value, p.options).getValue(
        context,
      );
    };

    const op1 = resolveParam(op1Param);
    const comp = resolveParam(compParam);
    const op2 = resolveParam(op2Param);

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

  isSuccessful() {
    return true;
  }
}
