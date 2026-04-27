import type { HookEvents } from "../interfaces/HookEvents.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";

export type HookEmitter = (
  event: HookEvents,
  context: ExecutionContext,
) => void;
