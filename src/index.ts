import type { ActionInterface } from "./interfaces/Action.js";
import type { ConditionInterface } from "./interfaces/Condition.js";
import type { ParameterInterface } from "./interfaces/Parameter.js";
import { AddTwoNumbersAction } from "./plugins/actions/AddTwoNumbersAction.js";
import { CompareTwoNumbersCondition } from "./plugins/conditions/CompareTwoNumbersCondition.js";
import { ComparatorParameter } from "./plugins/parameters/ComparatorParameter.js";
import { SimpleNumberParameter } from "./plugins/parameters/SimpleNumberParameter.js";
import { SimpleSelectParameter } from "./plugins/parameters/SimpleSelectParameter.js";
import { SimpleStringParameter } from "./plugins/parameters/SimpleStringParameter.js";
import { SimpleRule } from "./plugins/rules/SimpleRule.js";
import type { ExecutionContext } from "./types/ExecutionContext.js";
import type { ExecutionResult } from "./types/ExecutionResult.js";

export interface IElementInstance {
  execute(context: ExecutionContext): ExecutionResult<any>;
}

export type ParameterConstructor<T = any> = new (
  id: string,
  type: string,
  name: string,
  value: any,
  options: any,
  defaultValue?: any,
) => IElementInstance & { getValue(context: ExecutionContext): T | null };

export type ActionConstructor = new (
  id: string,
  type: string,
  params: ParameterInterface[],
  options: any,
  neuron: Neuron,
) => IElementInstance;

export type ConditionConstructor = new (
  id: string,
  type: string,
  params: ParameterInterface[],
  options: any,
  neuron: Neuron,
) => IElementInstance;

export type RuleConstructor = new (
  id: string,
  type: string,
  conditions: ConditionInterface[],
  actions: ActionInterface[],
  options: any,
) => IElementInstance;

export class Neuron {
  private registries = {
    parameters: new Map<string, ParameterConstructor>(),
    conditions: new Map<string, ConditionConstructor>(),
    actions: new Map<string, ActionConstructor>(),
    rules: new Map<string, RuleConstructor>(),
  };

  constructor() {
    this.registerParameter(
      SimpleNumberParameter.TYPE,
      SimpleNumberParameter as any,
    );
    this.registerParameter(
      SimpleStringParameter.TYPE,
      SimpleStringParameter as any,
    );
    this.registerParameter(
      ComparatorParameter.TYPE,
      ComparatorParameter as any,
    );
    this.registerParameter(
      SimpleSelectParameter.TYPE,
      SimpleSelectParameter as any,
    );

    this.registerCondition(
      CompareTwoNumbersCondition.TYPE,
      CompareTwoNumbersCondition as any,
    );

    this.registerAction(AddTwoNumbersAction.TYPE, AddTwoNumbersAction as any);

    this.registerRule(SimpleRule.TYPE, SimpleRule as any);
  }

  registerParameter(type: string, ctor: ParameterConstructor) {
    this.registries.parameters.set(type, ctor);
  }

  getParameter(type: string): ParameterConstructor | undefined {
    return this.registries.parameters.get(type);
  }

  registerCondition(type: string, ctor: ConditionConstructor) {
    this.registries.conditions.set(type, ctor);
  }

  getCondition(type: string): ConditionConstructor | undefined {
    return this.registries.conditions.get(type);
  }

  registerAction(type: string, ctor: ActionConstructor) {
    this.registries.actions.set(type, ctor);
  }

  getAction(type: string): ActionConstructor | undefined {
    return this.registries.actions.get(type);
  }

  registerRule(type: string, ctor: RuleConstructor) {
    this.registries.rules.set(type, ctor);
  }

  getRule(type: string): RuleConstructor | undefined {
    return this.registries.rules.get(type);
  }
}
