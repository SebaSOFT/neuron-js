import { AbstractParameter } from "../../abstracts/AbstractParameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";

export type Comparator = "=" | "!=" | ">" | "<" | ">=" | "<=";
const VALID_COMPARATORS: Comparator[] = ["=", "!=", ">", "<", ">=", "<="];

export class ComparatorParameter extends AbstractParameter<Comparator> {
  static readonly TYPE = "comparator";

  getValue(_context: ExecutionContext): Comparator | null {
    if (this.value === null) {
      return this.defaultValue ?? null;
    }
    const val = String(this.value) as Comparator;
    const valid = VALID_COMPARATORS.includes(val);
    return valid ? val : (this.defaultValue ?? null);
  }
}
