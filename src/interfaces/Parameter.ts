import type { ElementInterface } from "./Element.js";

export interface ParameterInterface<TValue = any, TOptions = any>
  extends ElementInterface<TOptions> {
  name: string;
  value: TValue | null;
  defaultValue?: TValue;
}
