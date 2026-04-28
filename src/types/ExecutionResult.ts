import type { ExecutionContext } from "./ExecutionContext.js";

/**
 * Represents the outcome of an execution unit (Script, Rule, Action, or Condition).
 *
 * @template TValue - The type of the value produced by the execution (e.g., number of rules for a Script, boolean for a Condition).
 */
export class ExecutionResult<TValue = any> {
  /**
   * @param success - Whether the execution completed without errors.
   * @param context - The state of the ExecutionContext after the run.
   * @param value - The primary output of the execution.
   * @param messages - Any informational or error messages generated.
   */
  constructor(
    public readonly success: boolean,
    public readonly context: ExecutionContext,
    public readonly value: TValue | null = null,
    public readonly messages: string[] = [],
  ) {}

  /**
   * Helper to check if the execution was successful.
   */
  isSuccessful(): boolean {
    return this.success;
  }
}
