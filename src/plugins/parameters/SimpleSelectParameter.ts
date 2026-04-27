import { AbstractParameter } from "../../abstracts/AbstractParameter.js";
import type { ExecutionContext } from "../../types/ExecutionContext.js";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptions {
  entries: SelectOption[];
}

export class SimpleSelectParameter extends AbstractParameter<
  string,
  SelectOptions
> {
  static readonly TYPE = "simple_select";

  getValue(_context: ExecutionContext): string | null {
    const entries = this.options?.entries || [];
    const found = entries.find((e) => e.value === this.value);

    if (found) {
      return found.value;
    }

    return this.defaultValue ?? null;
  }

  getDisplayLabel(): string {
    const entries = this.options?.entries || [];
    const found = entries.find((e) => e.value === this.value);
    return found ? found.label : "{none}";
  }
}
