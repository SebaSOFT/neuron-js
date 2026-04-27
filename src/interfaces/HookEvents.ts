export enum HookEvents {
  ON_SCRIPT_START = "on_script_start",
  ON_RULE_START = "on_rule_start",
  ON_CONDITION_START = "pre_condition_start",
  ON_ACTION_START = "pre_action_start",
  ON_SCRIPT_END = "pre_script_end",
  ON_RULE_END = "on_rule_end",
  ON_CONDITION_END = "pre_condition_end",
  ON_ACTION_END = "pre_action_end",
  ON_SCRIPT_ERROR = "on_script_error",
  ON_RULE_ERROR = "on_rule_error",
  ON_CONDITION_ERROR = "on_condition_error",
  ON_ACTION_ERROR = "on_action_error",
}
