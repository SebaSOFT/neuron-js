import type { ParameterInterface } from "../interfaces/Parameter.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { ExecutionResult } from "../types/ExecutionResult.js";
import { AbstractElement } from "./AbstractElement.js";

export abstract class AbstractParameter<TValue = any, TOptions = any>
  extends AbstractElement<TOptions>
  implements ParameterInterface<TValue, TOptions>
{
  constructor(
    id: string,
    type: string,
    public readonly name: string,
    public value: TValue | null,
    options: TOptions,
    public readonly defaultValue?: TValue,
  ) {
    super(id, type, options);
  }

  abstract getValue(context: ExecutionContext): TValue | null;

  execute(context: ExecutionContext): ExecutionResult<TValue | null> {
    try {
      const value = this.getValue(context);
      return new ExecutionResult(true, context, value);
    } catch (error: any) {
      return new ExecutionResult(false, context, null, [
        error.message || String(error),
      ]);
    }
  }

  toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      value: this.value,
      options: this.options,
    };
  }
}
