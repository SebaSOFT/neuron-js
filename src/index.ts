export type Constructor<T> = new (...args: any[]) => T;

export class Neuron {
  private registries = {
    parameters: new Map<string, Constructor<any>>(),
    conditions: new Map<string, Constructor<any>>(),
    actions: new Map<string, Constructor<any>>(),
    rules: new Map<string, Constructor<any>>(),
  };

  registerParameter(type: string, ctor: Constructor<any>) {
    this.registries.parameters.set(type, ctor);
  }

  getParameter(type: string) {
    return this.registries.parameters.get(type);
  }

  registerCondition(type: string, ctor: Constructor<any>) {
    this.registries.conditions.set(type, ctor);
  }

  getCondition(type: string) {
    return this.registries.conditions.get(type);
  }

  registerAction(type: string, ctor: Constructor<any>) {
    this.registries.actions.set(type, ctor);
  }

  getAction(type: string) {
    return this.registries.actions.get(type);
  }

  registerRule(type: string, ctor: Constructor<any>) {
    this.registries.rules.set(type, ctor);
  }

  getRule(type: string) {
    return this.registries.rules.get(type);
  }
}
