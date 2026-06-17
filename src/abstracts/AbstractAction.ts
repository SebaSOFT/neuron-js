import type { Neuron } from "../index.js";
import type { ActionOptions } from "../interfaces/Action.js";
import type { ParameterInterface } from "../interfaces/Parameter.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";
import { AbstractElement } from "./AbstractElement.js";

export abstract class AbstractAction<
  TOptions extends ActionOptions = ActionOptions,
> extends AbstractElement<TOptions> {
  public readonly params: Map<
    string,
    { getValue(context: ExecutionContext): unknown | null }
  >;

  constructor(
    id: string,
    type: string,
    public readonly rawParams: ParameterInterface[],
    options: TOptions,
    protected readonly neuron: Neuron,
  ) {
    super(id, type, options);
    this.params = neuron.createParameterMap(rawParams);
  }

  toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      params: this.rawParams,
      options: this.options,
    };
  }
}
