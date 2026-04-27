import type { ExecutionContext } from "./ExecutionContext.js";

export class ExecutionResult<TValue = any> {
  constructor(
    public readonly success: boolean,
    public readonly context: ExecutionContext,
    public readonly value: TValue | null = null,
    public readonly messages: string[] = [],
  ) {}

  isSuccessful(): boolean {
    return this.success;
  }
}
