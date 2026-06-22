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

class SetLangGraphDecisionAction {
  static readonly TYPE = "set_langgraph_decision";

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
    const nextNode = this.resolveParam(context, "nextNode");
    const requiresApprovalRaw = this.resolveParam(context, "requiresApproval");
    const reason = this.resolveParam(context, "reason");

    if (
      typeof nextNode !== "string" ||
      typeof requiresApprovalRaw !== "string" ||
      typeof reason !== "string"
    ) {
      return new ExecutionResult(false, context, null, [
        "Invalid LangGraph decision input",
      ]);
    }

    const requiresApproval = requiresApprovalRaw === "true";
    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        {
          type: MessageType.INFO,
          text: `LangGraph next node: ${nextNode}; approval required: ${requiresApproval}`,
        },
      ],
      state: {
        ...context.state,
        workflow: { nextNode, requiresApproval, reason },
      },
    };

    return new ExecutionResult(true, nextContext, nextNode, [
      `INFO: Deterministic LangGraph decision set to ${nextNode}`,
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
neuron.registerParameter(StateNumberParameter.TYPE, StateNumberParameter);
neuron.registerAction(SetLangGraphDecisionAction.TYPE, SetLangGraphDecisionAction);

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
  | { nextNode?: string; requiresApproval?: boolean; reason?: string }
  | undefined;
const actual = {
  ...summary,
  nextNode: workflow?.nextNode,
  requiresApproval: workflow?.requiresApproval,
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
