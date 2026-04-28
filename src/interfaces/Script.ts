import type { RuleInterface } from "./Rule.js";

/**
 * Represents a complete set of rules to be executed by the engine.
 * The script is the top-level serializable container for all logic.
 */
export interface ScriptInterface {
  /**
   * Unique identifier for the script.
   */
  id: string;

  /**
   * The ordered list of rules that comprise the script's logic.
   */
  rules: RuleInterface[];
}
