import type { ActionInterface } from "../interfaces/Action.js";
import type { ConditionInterface } from "../interfaces/Condition.js";
import type { RuleOptions } from "../interfaces/Rule.js";
import { AbstractElement } from "./AbstractElement.js";

export abstract class AbstractRule extends AbstractElement<RuleOptions> {
  constructor(
    id: string,
    type: string,
    public readonly conditions: ConditionInterface[],
    public readonly actions: ActionInterface[],
    options: RuleOptions,
  ) {
    super(id, type, options);
  }
}
