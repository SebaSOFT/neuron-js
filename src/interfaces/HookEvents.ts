/**
 * Enumeration of all lifecycle events emitted during script execution.
 * These can be used with a HookEmitter to monitor performance, log data, or handle side effects.
 */
export enum HookEvents {
  /** Emitted when the execution of a script starts. */
  ON_SCRIPT_START = "on_script_start",
  /** Emitted when a specific rule begins evaluation. */
  ON_RULE_START = "on_rule_start",
  /** Emitted before a condition starts evaluation. */
  ON_CONDITION_START = "pre_condition_start",
  /** Emitted before an action starts execution. */
  ON_ACTION_START = "pre_action_start",
  /** Emitted when a script successfully completes all rules. */
  ON_SCRIPT_END = "pre_script_end",
  /** Emitted when a rule finishes evaluation (regardless of outcome). */
  ON_RULE_END = "on_rule_end",
  /** Emitted after a condition evaluation completes. */
  ON_CONDITION_END = "pre_condition_end",
  /** Emitted after an action execution completes. */
  ON_ACTION_END = "pre_action_end",
  /** Emitted if an unhandled error occurs during script execution. */
  ON_SCRIPT_ERROR = "on_script_error",
  /** Emitted if an error occurs while evaluating a specific rule. */
  ON_RULE_ERROR = "on_rule_error",
  /** Emitted if an error occurs during condition evaluation. */
  ON_CONDITION_ERROR = "on_condition_error",
  /** Emitted if an error occurs during action execution. */
  ON_ACTION_ERROR = "on_action_error",
}
