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

class SetDecisionAction {
  static readonly TYPE = "set_decision";

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

  execute(context: ExecutionContext): ExecutionResult<string | null> {
    const decisionParam = this.params.find((param) => param.name === "decision");
    if (!decisionParam) {
      return new ExecutionResult(false, context, null, ["Missing decision parameter"]);
    }

    const ParamCtor = this.neuron.getParameter(decisionParam.type);
    const decision = ParamCtor
      ? new ParamCtor(decisionParam.id, decisionParam.type, decisionParam.name, decisionParam.value, decisionParam.options, decisionParam.defaultValue).getValue(context)
      : null;

    if (typeof decision !== "string") {
      return new ExecutionResult(false, context, null, ["Invalid decision value"]);
    }

    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `Eligibility decision: ${decision}` },
      ],
      state: {
        ...context.state,
        eligibility: { eligible: decision === "approved", decision },
      },
    };

    return new ExecutionResult(true, nextContext, decision);
  }
}

const neuron = new Neuron();
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
neuron.registerAction(SetDecisionAction.TYPE, SetDecisionAction);

const result = new Synapse(neuron).execute(script, input as ExecutionContext);
const eligibility = result.context.state.eligibility as { eligible?: boolean; decision?: string };
const actual = {
  ok: result.isSuccessful(),
  rulesExecuted: result.value,
  eligible: eligibility.eligible,
  decision: eligibility.decision,
  messages: result.context.messages.map((message) => message.text),
};

if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
  console.error(JSON.stringify({ expected: expectedOutput, actual }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(actual, null, 2));

