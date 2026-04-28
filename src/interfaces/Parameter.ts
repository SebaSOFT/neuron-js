import type { ElementInterface } from "./Element.js";

/**
 * Represents a configurable input value for Actions and Conditions.
 * Parameters allow for reusable logic templates by decoupling the implementation from the values.
 *
 * @template TValue - The primitive or complex type of the parameter's value.
 * @template TOptions - The type of configuration options for this parameter.
 */
export interface ParameterInterface<TValue = any, TOptions = any>
  extends ElementInterface<TOptions> {
  /**
   * The semantic name of the parameter (e.g., "recipient", "threshold").
   */
  name: string;

  /**
   * The actual value assigned to the parameter.
   */
  value: TValue | null;

  /**
   * An optional fallback value if the primary value is missing or null.
   */
  defaultValue?: TValue;
}
