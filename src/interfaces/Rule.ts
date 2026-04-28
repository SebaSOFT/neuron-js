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
 * - **Empty Conditions**: The rule is considered "Always" and will automatically execute actions.
 * - **Empty Actions**: The rule will "Do Nothing" (no side effects).
 *
 * @template TOptions - The type of configuration options for this rule.
 */
export interface RuleInterface<TOptions extends RuleOptions = RuleOptions>
  extends ElementInterface<TOptions> {
  /**
   * List of conditions that must be satisfied for the actions to execute.
   * If empty, actions are always executed.
   */
  conditions: ConditionInterface[];

  /**
   * List of actions to perform if the conditions are met.
   * If empty, the rule has no side effects.
   */
  actions: ActionInterface[];
}
