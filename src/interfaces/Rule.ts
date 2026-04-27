import type { ActionInterface } from "./Action.js";
import type { ConditionInterface } from "./Condition.js";
import type { ElementInterface } from "./Element.js";

export interface RuleOptions {
  disabled?: boolean;
}

export interface RuleInterface<TOptions extends RuleOptions = RuleOptions>
  extends ElementInterface<TOptions> {
  conditions: ConditionInterface[];
  actions: ActionInterface[];
}
