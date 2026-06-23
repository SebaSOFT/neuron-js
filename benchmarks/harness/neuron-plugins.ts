// Neuron-JS benchmark plugins.
//
// These parameter/action classes mirror the ones defined inline in the runnable
// examples (examples/pricing-rules/run.ts, eligibility-check/run.ts,
// workflow-routing/run.ts). They are duplicated here so the benchmark harness can
// register them without importing example run scripts and without editing src/.

import {
  type ActionOptions,
  type ExecutionContext,
  ExecutionResult,
  MessageType,
  type Neuron,
  type ParameterInterface,
} from "../../dist/esm/index.js";
import { readPath } from "./read-path.ts";

export function readStatePath(
  context: ExecutionContext,
  path: string,
): unknown {
  return readPath(context.state, path);
}

export class StateNumberParameter {
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

function resolveParam(
  neuron: Neuron,
  params: ParameterInterface[],
  context: ExecutionContext,
  name: string,
): unknown {
  const param = params.find((item) => item.name === name);
  if (!param) return null;
  const ParamCtor = neuron.getParameter(param.type);
  return ParamCtor
    ? new ParamCtor(
        param.id,
        param.type,
        param.name,
        param.value,
        param.options,
      ).getValue(context)
    : null;
}

export class ApplyDiscountAction {
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
    const percent = resolveParam(this.neuron, this.params, context, "percent");
    const subtotal = readStatePath(context, "cart.subtotal");

    if (typeof subtotal !== "number" || typeof percent !== "number") {
      return new ExecutionResult(false, context, null, [
        "Invalid discount input",
      ]);
    }

    const discountAmount = Math.round(subtotal * (percent / 100));
    const finalTotal = subtotal - discountAmount;
    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        {
          type: MessageType.INFO,
          text: `Applied ${percent}% discount: -${discountAmount}`,
        },
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

export class SetDecisionAction {
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
    const decision = resolveParam(
      this.neuron,
      this.params,
      context,
      "decision",
    );

    if (typeof decision !== "string") {
      return new ExecutionResult(false, context, null, [
        "Invalid decision value",
      ]);
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

export class SetRouteAction {
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

  execute(context: ExecutionContext): ExecutionResult<string | null> {
    const route = resolveParam(this.neuron, this.params, context, "route");
    const slaHours = resolveParam(
      this.neuron,
      this.params,
      context,
      "slaHours",
    );

    if (typeof route !== "string" || typeof slaHours !== "number") {
      return new ExecutionResult(false, context, null, ["Invalid route input"]);
    }

    const nextContext: ExecutionContext = {
      ...context,
      messages: [
        ...context.messages,
        {
          type: MessageType.INFO,
          text: `Workflow route: ${route} within ${slaHours}h`,
        },
      ],
      state: {
        ...context.state,
        workflow: { route, slaHours },
      },
    };

    return new ExecutionResult(true, nextContext, route);
  }
}
