import type {
  ExecutionExplanationEvent,
  ValidationError,
} from "../contracts/validation.js";
import type { ScriptInterface } from "../interfaces/Script.js";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonSchemaTypeName =
  | "array"
  | "boolean"
  | "integer"
  | "null"
  | "number"
  | "object"
  | "string";

export interface JsonSchema {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  type?: JsonSchemaTypeName | JsonSchemaTypeName[];
  enum?: JsonValue[];
  const?: JsonValue;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  additionalProperties?: boolean | JsonSchema;
  [keyword: string]: unknown;
}

export type DecisionStatus =
  | "succeeded"
  | "invalid_context"
  | "no_decision"
  | "execution_failed";

export interface DecisionComponentManifest {
  rules: string[];
  conditions: string[];
  actions: string[];
  parameters: string[];
}

export interface DecisionDefinition {
  id: string;
  version: string;
  contextSchema: JsonSchema;
  outcomeSchema: JsonSchema;
  components: DecisionComponentManifest;
  script: ScriptInterface;
}

export type DecisionContext<TContext extends JsonValue = JsonValue> = TContext;
export type DecisionOutcome<TOutcome extends JsonValue = JsonValue> = TOutcome;

export interface DecisionCorrelationMetadata {
  correlationId?: string;
  causationId?: string;
  source?: string;
  [key: string]: JsonValue | undefined;
}

export interface DecisionReceipt {
  decisionId: string;
  decisionVersion: string;
  definitionHash: string;
  contextHash?: string;
  registryManifestHash: string;
  runtimeVersion: string;
  status: DecisionStatus;
  correlation?: DecisionCorrelationMetadata;
  diagnostics?: ValidationError[];
  trace: ExecutionExplanationEvent[];
}

export interface DecisionEvaluation<TOutcome extends JsonValue = JsonValue> {
  status: DecisionStatus;
  outcome?: DecisionOutcome<TOutcome>;
  diagnostics: ValidationError[];
  receipt: DecisionReceipt;
}

export interface DecisionReplayRequest {
  definition: DecisionDefinition;
  context: JsonValue;
  registryManifest: DecisionComponentManifest;
  expectedReceipt: Pick<
    DecisionReceipt,
    | "decisionId"
    | "decisionVersion"
    | "definitionHash"
    | "contextHash"
    | "registryManifestHash"
    | "runtimeVersion"
  >;
}

export interface DecisionTestVector<TOutcome extends JsonValue = JsonValue> {
  name: string;
  definition?: DecisionDefinition;
  definitionRef?: string;
  context: JsonValue;
  expectedStatus: DecisionStatus;
  expectedOutcome?: DecisionOutcome<TOutcome>;
}
