import {
  ExecutionResult,
  MessageType,
  Neuron,
  Synapse,
  type ActionOptions,
  type ExecutionContext,
  type ParameterInterface,
} from "../../dist/esm/index.js";
import expectedOutput from "./expected-output.json" with { type: "json" };
import input from "./input.json" with { type: "json" };
import script from "./rules.json" with { type: "json" };

function readStatePath(context: ExecutionContext, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, context.state);
}

class StateNumberParameter {
  static readonly TYPE = "state_number";

  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly value: string;
  readonly options: Record<string, unknown>;

  constructor(
    id: string,
    type: string,
    name: string,
    value: string,
    options: Record<string, unknown>,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.value = value;
    this.options = options;
  }

  getValue(context: ExecutionContext): number | null {
    const value = readStatePath(context, this.value);
    return typeof value === "number" ? value : null;
  }
}

class ApplyDiscountAction {
  static readonly TYPE = "apply_discount";

  readonly id: string;
  readonly type: string;
  private readonly params: ParameterInterface[];
  readonly options: ActionOptions;
  private readonly neuron: Neuron;

  constructor(
    id: string,
    type: string,
    params: ParameterInterface[],
    options: ActionOptions,
    neuron: Neuron,
  ) {
    this.id = id;
    this.type = type;
    this.params = params;
    this.options = options;
    this.neuron = neuron;
  }

  execute(context: ExecutionContext): ExecutionResult<number | null> {
    const percentParam = this.params.find((param) => param.name === "percent");
    if (!percentParam) {
      return new ExecutionResult(false, context, null, ["Missing percent parameter"]);
    }

    const ParamCtor = this.neuron.getParameter(percentParam.type);
    const percent = ParamCtor
      ? new ParamCtor(percentParam.id, percentParam.type, percentParam.name, percentParam.value, percentParam.options, percentParam.defaultValue).getValue(context)
      : null;
    const subtotal = readStatePath(context, "cart.subtotal");

    if (typeof subtotal !== "number" || typeof percent !== "number") {
      return new ExecutionResult(false, context, null, ["Invalid discount input"]);
    }

    const discountAmount = Math.round(subtotal * (percent / 100));
    const finalTotal = subtotal - discountAmount;
    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `Applied ${percent}% discount: -${discountAmount}` },
      ],
      state: {
        ...context.state,
        cart: {
          ...(context.state.cart as Record<string, unknown>),
          discountPercent: percent,
          discountAmount,
          finalTotal,
        },
      },
    };

    return new ExecutionResult(true, nextContext, finalTotal);
  }
}

const neuron = new Neuron();
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
neuron.registerAction(ApplyDiscountAction.TYPE, ApplyDiscountAction);

const result = new Synapse(neuron).execute(script, input as ExecutionContext);
const cart = result.context.state.cart as { finalTotal?: number; discountAmount?: number };
const actual = {
  ok: result.isSuccessful(),
  rulesExecuted: result.value,
  finalTotal: cart.finalTotal,
  discountAmount: cart.discountAmount,
  messages: result.context.messages.map((message) => message.text),
};

if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
  console.error(JSON.stringify({ expected: expectedOutput, actual }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(actual, null, 2));

