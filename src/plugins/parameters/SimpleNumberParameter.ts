import { AbstractParameter } from "../../abstracts/AbstractParameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";

export class SimpleNumberParameter extends AbstractParameter<number> {
  static readonly TYPE = "simple_number";

  getValue(_context: ExecutionContext): number | null {
    if (this.value === null) {
      return this.defaultValue ?? null;
    }
    const num = Number(this.value);
    return Number.isNaN(num) ? null : num;
  }
}
