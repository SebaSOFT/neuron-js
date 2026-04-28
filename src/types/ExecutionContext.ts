/**
 * Severity levels for execution messages.
 */
export enum MessageType {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Represents a log message or audit entry generated during execution.
 */
export interface ExecutionMessage {
  /** The severity level of the message. */
  type: MessageType;
  /** The descriptive text of the message. */
  text: string;
}

/**
 * The shared state container that travels through the execution engine.
 */
export interface ExecutionContext {
  /** Accumulation of all messages generated during the current script run. */
  messages: ExecutionMessage[];
  /** The primary data object being processed and mutated by actions. */
  state: Record<string, any>;
}
