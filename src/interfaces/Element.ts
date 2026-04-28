/**
 * Represents the base interface for all elements within the rules engine.
 * Elements are the building blocks of scripts, pulses, actions, conditions, and parameters.
 * 
 * @template TOptions - The type of configuration options for this element.
 */
export interface ElementInterface<TOptions = any> {
  /**
   * Unique identifier for the element instance.
   */
  id: string;

  /**
   * The registered type name of the element.
   * This type is used by the Registry (Neuron) to look up the correct implementation.
   */
  type: string;

  /**
   * Configuration options specific to this element instance.
   */
  options: TOptions;
}
