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

class SetRouteAction {
  static readonly TYPE = "set_route";

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

  private resolveParam(context: ExecutionContext, name: string): unknown {
    const param = this.params.find((item) => item.name === name);
    if (!param) return null;
    const ParamCtor = this.neuron.getParameter(param.type);
    return ParamCtor
      ? new ParamCtor(param.id, param.type, param.name, param.value, param.options, param.defaultValue).getValue(context)
      : null;
  }

  execute(context: ExecutionContext): ExecutionResult<string | null> {
    const route = this.resolveParam(context, "route");
    const slaHours = this.resolveParam(context, "slaHours");

    if (typeof route !== "string" || typeof slaHours !== "number") {
      return new ExecutionResult(false, context, null, ["Invalid route input"]);
    }

    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `Workflow route: ${route} within ${slaHours}h` },
      ],
      state: {
        ...context.state,
        workflow: { route, slaHours },
      },
    };

    return new ExecutionResult(true, nextContext, route);
  }
}

const neuron = new Neuron();
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
neuron.registerAction(SetRouteAction.TYPE, SetRouteAction);

const result = new Synapse(neuron).execute(script, input as ExecutionContext);
const workflow = result.context.state.workflow as { route?: string; slaHours?: number };
const actual = {
  ok: result.isSuccessful(),
  rulesExecuted: result.value,
  route: workflow.route,
  slaHours: workflow.slaHours,
  messages: result.context.messages.map((message) => message.text),
};

if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
  console.error(JSON.stringify({ expected: expectedOutput, actual }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(actual, null, 2));

