import { AbstractParameter } from "../../abstracts/AbstractParameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";

export type Comparator = "=" | "!=" | ">" | "<" | ">=" | "<=";

export class ComparatorParameter extends AbstractParameter<Comparator> {
  static readonly TYPE = "comparator";

  getValue(_context: ExecutionContext): Comparator | null {
    if (this.value === null) {
      return this.defaultValue ?? null;
    }
    const val = String(this.value) as Comparator;
    const valid = ["=", "!=", ">", "<", ">=", "<="].includes(val);
    return valid ? val : (this.defaultValue ?? null);
  }
}
