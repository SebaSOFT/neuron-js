import { AbstractRule } from "../../abstracts/AbstractRule.js";
import type { RuleInterface } from "../../interfaces/Rule.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";
import { ExecutionResult } from "../../types/ExecutionResult.js";

export class SimpleRule extends AbstractRule {
  static readonly TYPE = "simple_rule";

  execute(context: ExecutionContext): ExecutionResult<void> {
    return new ExecutionResult(true, context);
  }

  toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      conditions: this.conditions,
      actions: this.actions,
      options: this.options,
    };
  }

  static fromJSON(jsonObject: RuleInterface): SimpleRule {
    return new SimpleRule(
      jsonObject.id,
      jsonObject.type,
      jsonObject.conditions,
      jsonObject.actions,
      jsonObject.options,
    );
  }
}
