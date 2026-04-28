import type { ElementInterface } from "./Element.js";
import type { ParameterInterface } from "./Parameter.js";

/**
 * Configuration options for a Condition.
 */
export interface ConditionOptions {
  /**
   * If true, this condition is treated as part of an OR group.
   * By default, conditions are evaluated with AND logic.
   */
  orCondition?: boolean;

  /**
   * If true, the result of the condition evaluation is flipped.
   */
  inverted?: boolean;

  /**
   * Whether the condition is disabled and should be treated as always true.
   */
  disabled?: boolean;
}

/**
 * Represents a logical predicate used to determine if a Rule should execute its actions.
 * 
 * @template TOptions - The type of configuration options for this condition.
 */
export interface ConditionInterface<
  TOptions extends ConditionOptions = ConditionOptions,
> extends ElementInterface<TOptions> {
  /**
   * The collection of input parameters used to evaluate the condition.
   */
  params: ParameterInterface[];
}
