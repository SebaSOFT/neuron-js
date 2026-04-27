import type { ElementInterface } from "../interfaces/Element.js";

export abstract class AbstractElement<TOptions = any>
  implements ElementInterface<TOptions>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly options: TOptions,
  ) {}

  abstract toJSON(): object;
}
