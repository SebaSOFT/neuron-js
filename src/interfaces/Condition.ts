import type { ElementInterface } from "./Element.js";
import type { ParameterInterface } from "./Parameter.js";

export interface ConditionOptions {
  orCondition?: boolean;
  inverted?: boolean;
  disabled?: boolean;
}

export interface ConditionInterface<
  TOptions extends ConditionOptions = ConditionOptions,
> extends ElementInterface<TOptions> {
  params: ParameterInterface[];
}
