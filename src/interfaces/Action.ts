import type { ElementInterface } from "./Element.js";
import type { ParameterInterface } from "./Parameter.js";

/**
 * Configuration options for an Action.
 */
export interface ActionOptions {
  /**
   * Whether the action is disabled and should be skipped during execution.
   */
  disabled?: boolean;
}

/**
 * Represents an operation to be performed when a Rule's conditions are met.
 *
 * @template TOptions - The type of configuration options for this action.
 */
export interface ActionInterface<TOptions extends ActionOptions = ActionOptions>
  extends ElementInterface<TOptions> {
  /**
   * The collection of input parameters required by this action.
   */
  params: ParameterInterface[];
}
