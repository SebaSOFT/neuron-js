import { AbstractParameter } from "../../abstracts/AbstractParameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";

export class SimpleStringParameter extends AbstractParameter<string> {
  static readonly TYPE = "simple_string";

  getValue(_context: ExecutionContext): string | null {
    return this.value ?? this.defaultValue ?? null;
  }
}
