export enum MessageType {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface ExecutionMessage {
  type: MessageType;
  text: string;
}

export interface ExecutionContext {
  messages: ExecutionMessage[];
  state: Record<string, any>;
}
