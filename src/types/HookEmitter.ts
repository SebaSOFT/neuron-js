import type { HookEvents } from "../interfaces/HookEvents.js";
import type { ExecutionContext } from "../types/ExecutionContext.js";

/**
 * Functional type for lifecycle hook callbacks.
 */
export type HookEmitter = (
  /** The lifecycle event being triggered. */
  event: HookEvents,
  /** The current state of the execution context. */
  context: ExecutionContext,
) => void;
