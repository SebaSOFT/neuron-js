import type { ActionInterface } from "./Action.js";
import type { ConditionInterface } from "./Condition.js";
import type { ElementInterface } from "./Element.js";

/**
 * Configuration options for a Rule.
 */
export interface RuleOptions {
  /**
   * Whether the rule is disabled and should be skipped.
   */
  disabled?: boolean;
}

/**
 * Represents a logical unit containing conditions and actions.
 * A Rule executes its actions only if its conditions evaluate to true.
 * 
 * @template TOptions - The type of configuration options for this rule.
 */
export interface RuleInterface<TOptions extends RuleOptions = RuleOptions>
  extends ElementInterface<TOptions> {
  /**
   * List of conditions that must be satisfied for the actions to execute.
   */
  conditions: ConditionInterface[];

  /**
   * List of actions to perform if the conditions are met.
   */
  actions: ActionInterface[];
}
