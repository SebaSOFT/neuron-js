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

/**
 * Interface for all executable element instances.
 */
export interface IElementInstance {
  /**
   * Executes the element logic within the given context.
   */
  execute(context: ExecutionContext): ExecutionResult<any>;
}

/** Constructor type for Parameters. */
export type ParameterConstructor<T = any> = new (
  id: string,
  type: string,
  name: string,
  value: any,
  options: any,
  defaultValue?: any,
) => IElementInstance & { getValue(context: ExecutionContext): T | null };

/** Constructor type for Actions. */
export type ActionConstructor = new (
  id: string,
  type: string,
  params: ParameterInterface[],
  options: any,
  neuron: Neuron,
) => IElementInstance;

/** Constructor type for Conditions. */
export type ConditionConstructor = new (
  id: string,
  type: string,
  params: ParameterInterface[],
  options: any,
  neuron: Neuron,
) => IElementInstance;

/** Constructor type for Rules. */
export type RuleConstructor = new (
  id: string,
  type: string,
  conditions: ConditionInterface[],
  actions: ActionInterface[],
  options: any,
) => IElementInstance;

/**
 * The Neuron class serves as the central component registry for the rules engine.
 * It manages the availability and instantiation of Parameters, Conditions, Actions, and Rules.
 */
export class Neuron {
  private registries = {
    parameters: new Map<string, ParameterConstructor>(),
    conditions: new Map<string, ConditionConstructor>(),
    actions: new Map<string, ActionConstructor>(),
    rules: new Map<string, RuleConstructor>(),
  };

  /**
   * Creates a new Neuron instance and registers the default built-in plugins.
   */
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

  /** Registers a custom parameter type. */
  registerParameter(type: string, ctor: ParameterConstructor) {
    this.registries.parameters.set(type, ctor);
  }

  /** Retrieves a parameter constructor by type. */
  getParameter(type: string): ParameterConstructor | undefined {
    return this.registries.parameters.get(type);
  }

  /**
   * Converts serializable parameter definitions into a name-keyed Map of parameter instances.
   *
   * Plugin authors still receive JSON-friendly arrays at the script boundary, but base
   * classes can expose a Map for ergonomic `this.params.get("name")` access.
   */
  createParameterMap(
    params: ParameterInterface[],
  ): Map<
    string,
    IElementInstance & { getValue(context: ExecutionContext): unknown | null }
  > {
    const parameterMap = new Map<
      string,
      IElementInstance & { getValue(context: ExecutionContext): unknown | null }
    >();

    for (const param of params) {
      const ParamCtor = this.getParameter(param.type);
      if (!ParamCtor) {
        continue;
      }

      parameterMap.set(
        param.name,
        new ParamCtor(
          param.id,
          param.type,
          param.name,
          param.value,
          param.options,
          param.defaultValue,
        ),
      );
    }

    return parameterMap;
  }

  /** Registers a custom condition type. */
  registerCondition(type: string, ctor: ConditionConstructor) {
    this.registries.conditions.set(type, ctor);
  }

  /** Retrieves a condition constructor by type. */
  getCondition(type: string): ConditionConstructor | undefined {
    return this.registries.conditions.get(type);
  }

  /** Registers a custom action type. */
  registerAction(type: string, ctor: ActionConstructor) {
    this.registries.actions.set(type, ctor);
  }

  /** Retrieves an action constructor by type. */
  getAction(type: string): ActionConstructor | undefined {
    return this.registries.actions.get(type);
  }

  /** Registers a custom rule type. */
  registerRule(type: string, ctor: RuleConstructor) {
    this.registries.rules.set(type, ctor);
  }

  /** Retrieves a rule constructor by type. */
  getRule(type: string): RuleConstructor | undefined {
    return this.registries.rules.get(type);
  }
}

export { AbstractAction } from "./abstracts/AbstractAction.js";
export { AbstractCondition } from "./abstracts/AbstractCondition.js";
export { AbstractElement } from "./abstracts/AbstractElement.js";
export { AbstractParameter } from "./abstracts/AbstractParameter.js";
export { AbstractRule } from "./abstracts/AbstractRule.js";
export type { ExplainExecutionOptions } from "./contracts/explain.js";
export { explainExecution } from "./contracts/explain.js";
export type {
  ExecutionExplanation,
  ExecutionExplanationEvent,
  ValidationError,
  ValidationResult,
} from "./contracts/validation.js";
export {
  summarizeExecutionOutput,
  validateExecutionContext,
  validateExecutionExplanation,
  validateExecutionOutput,
  validateScript,
  validateValidationErrors,
} from "./contracts/validation.js";
export type { ActionInterface, ActionOptions } from "./interfaces/Action.js";
export type {
  ConditionInterface,
  ConditionOptions,
} from "./interfaces/Condition.js";
export type { ElementInterface } from "./interfaces/Element.js";
export { HookEvents } from "./interfaces/HookEvents.js";
export type { ParameterInterface } from "./interfaces/Parameter.js";
export type { RuleInterface, RuleOptions } from "./interfaces/Rule.js";
export type { ScriptInterface } from "./interfaces/Script.js";
export { AddTwoNumbersAction } from "./plugins/actions/AddTwoNumbersAction.js";
export { CompareTwoNumbersCondition } from "./plugins/conditions/CompareTwoNumbersCondition.js";
export type { Comparator } from "./plugins/parameters/ComparatorParameter.js";
export { ComparatorParameter } from "./plugins/parameters/ComparatorParameter.js";
export { SimpleNumberParameter } from "./plugins/parameters/SimpleNumberParameter.js";
export type {
  SelectOption,
  SelectOptions,
} from "./plugins/parameters/SimpleSelectParameter.js";
export { SimpleSelectParameter } from "./plugins/parameters/SimpleSelectParameter.js";
export { SimpleStringParameter } from "./plugins/parameters/SimpleStringParameter.js";
export { SimpleRule } from "./plugins/rules/SimpleRule.js";
export { Synapse } from "./Synapse.js";
export type {
  ExecutionContext,
  ExecutionMessage,
} from "./types/ExecutionContext.js";
export { MessageType } from "./types/ExecutionContext.js";
export { ExecutionResult } from "./types/ExecutionResult.js";
export type { HookEmitter } from "./types/HookEmitter.js";
