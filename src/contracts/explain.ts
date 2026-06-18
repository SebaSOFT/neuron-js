import type { ScriptInterface } from "../interfaces/Script.js";
import type { ExecutionResult } from "../types/ExecutionResult.js";
import type {
  ExecutionExplanation,
  ExecutionExplanationEvent,
} from "./validation.js";

export interface ExplainExecutionOptions {
  script: ScriptInterface;
  result: ExecutionResult<number>;
}

export function explainExecution({
  script,
  result,
}: ExplainExecutionOptions): ExecutionExplanation {
  const trace: ExecutionExplanationEvent[] = [
    {
      step: 1,
      type: "script_received",
      message: `Script ${script.id} contains ${script.rules.length} rule(s).`,
    },
  ];

  script.rules.forEach((rule, index) => {
    trace.push({
      step: trace.length + 1,
      type: rule.options?.disabled ? "rule_skipped" : "rule_available",
      ruleId: rule.id,
      message: rule.options?.disabled
        ? `Rule ${rule.id} is disabled.`
        : `Rule ${rule.id} has ${rule.conditions.length} condition(s) and ${rule.actions.length} action(s).`,
    });

    if (index === script.rules.length - 1) {
      trace.push({
        step: trace.length + 1,
        type: result.isSuccessful()
          ? "execution_completed"
          : "execution_failed",
        ruleId: rule.id,
        message: result.isSuccessful()
          ? `Execution completed with ${result.value ?? 0} rule(s) executed.`
          : "Execution failed before completing all rules.",
      });
    }
  });

  if (script.rules.length === 0) {
    trace.push({
      step: trace.length + 1,
      type: "execution_completed",
      message: "Execution completed with an empty script.",
    });
  }

  return {
    scriptId: script.id,
    ok: result.isSuccessful(),
    rulesEvaluated: script.rules.filter((rule) => !rule.options?.disabled)
      .length,
    rulesExecuted: typeof result.value === "number" ? result.value : null,
    messages: result.messages,
    trace,
  };
}
