import {
  ExecutionResult,
  MessageType,
  Neuron,
  Synapse,
  explainExecution,
  summarizeExecutionOutput,
  validateExecutionContext,
  validateExecutionExplanation,
  validateScript,
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

class StateStringParameter {
  static readonly TYPE = "state_string";

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

  getValue(context: ExecutionContext): string | null {
    const value = readStatePath(context, this.value);
    return typeof value === "string" ? value : null;
  }
}

class CompareTwoStringsCondition {
  static readonly TYPE = "compare_two_strings";

  readonly id: string;
  readonly type: string;
  private readonly params: ParameterInterface[];
  readonly options: Record<string, unknown>;
  private readonly neuron: Neuron;

  constructor(
    id: string,
    type: string,
    params: ParameterInterface[],
    options: Record<string, unknown>,
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
      ? new ParamCtor(
          param.id,
          param.type,
          param.name,
          param.value,
          param.options,
          param.defaultValue,
        ).getValue(context)
      : null;
  }

  execute(context: ExecutionContext): ExecutionResult<boolean> {
    const op1 = this.resolveParam(context, "op1");
    const comp = this.resolveParam(context, "comp");
    const op2 = this.resolveParam(context, "op2");

    if (
      typeof op1 !== "string" ||
      typeof comp !== "string" ||
      typeof op2 !== "string"
    ) {
      return new ExecutionResult(false, context, false, [
        "Invalid string comparison input",
      ]);
    }

    if (comp !== "=" && comp !== "!=") {
      return new ExecutionResult(false, context, false, [
        `Unsupported string comparator: ${comp}`,
      ]);
    }

    const matched = comp === "=" ? op1 === op2 : op1 !== op2;
    return new ExecutionResult(true, context, matched);
  }
}

class SetSupportRouteAction {
  static readonly TYPE = "set_support_route";

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
      ? new ParamCtor(
          param.id,
          param.type,
          param.name,
          param.value,
          param.options,
          param.defaultValue,
        ).getValue(context)
      : null;
  }

  execute(context: ExecutionContext): ExecutionResult<string | null> {
    const route = this.resolveParam(context, "route");
    const slaHours = this.resolveParam(context, "slaHours");
    const reason = this.resolveParam(context, "reason");

    if (
      typeof route !== "string" ||
      typeof slaHours !== "number" ||
      typeof reason !== "string"
    ) {
      return new ExecutionResult(false, context, null, [
        "Invalid support route input",
      ]);
    }

    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        { type: MessageType.INFO, text: `n8n route: ${route} within ${slaHours}h` },
      ],
      state: {
        ...context.state,
        workflow: { route, slaHours, reason },
      },
    };

    return new ExecutionResult(true, nextContext, route, [
      `INFO: Deterministic support route set to ${route} within ${slaHours}h`,
    ]);
  }
}

const scriptValidation = validateScript(script);
const contextValidation = validateExecutionContext(input);

if (!scriptValidation.ok || !contextValidation.ok) {
  console.error(
    JSON.stringify(
      { ok: false, errors: [...scriptValidation.errors, ...contextValidation.errors] },
      null,
      2,
    ),
  );
  process.exit(1);
}

const neuron = new Neuron();
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter as any);
neuron.registerParameter(StateStringParameter.TYPE, StateStringParameter as any);
neuron.registerCondition(CompareTwoStringsCondition.TYPE, CompareTwoStringsCondition as any);
neuron.registerAction(SetSupportRouteAction.TYPE, SetSupportRouteAction);

const result = new Synapse(neuron).execute(script, input as ExecutionContext);
const summary = summarizeExecutionOutput(result);
const explanation = explainExecution({ script, result });
const explanationValidation = validateExecutionExplanation(explanation);

if (!explanationValidation.ok) {
  console.error(
    JSON.stringify({ ok: false, errors: explanationValidation.errors }, null, 2),
  );
  process.exit(1);
}

const workflow = result.context.state.workflow as
  | { route?: string; slaHours?: number; reason?: string }
  | undefined;
const actual = {
  ...summary,
  route: workflow?.route,
  slaHours: workflow?.slaHours,
  reason: workflow?.reason,
  explanation: {
    scriptId: explanation.scriptId,
    rulesEvaluated: explanation.rulesEvaluated,
    rulesExecuted: explanation.rulesExecuted,
    traceTypes: explanation.trace.map((event) => event.type),
  },
};

if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
  console.error(JSON.stringify({ expected: expectedOutput, actual }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(actual, null, 2));
