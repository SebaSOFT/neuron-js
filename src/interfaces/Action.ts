import type { ElementInterface } from "./Element.js";
import type { ParameterInterface } from "./Parameter.js";

export interface ActionOptions {
  disabled?: boolean;
}

export interface ActionInterface<TOptions extends ActionOptions = ActionOptions>
  extends ElementInterface<TOptions> {
  params: ParameterInterface[];
}
