export interface ReportSchema {
  id: string;
  organizationId: string;
  projectId: string;
  environment?: string;
  timestamp?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  promptCost?: number;
  completionCost?: number;
  totalCost?: number;
  duration?: number;
  type?: string;
  client?: string;
  clientVersion?: string;
  model?: string;
  modelAuthor?: string;
  provider?: string;
  requestTimestamp?: string;
  requestBody?: string;
  isError?: boolean;
  responseStatusCode?: number;
  responseTimestamp?: string;
  responseBody?: string;
  cacheEnabled?: boolean;
  cacheHit?: boolean;
  promptId?: string;
}

export interface SerializedReport
  extends Omit<ReportSchema, "requestBody" | "responseBody"> {
  requestBody: Record<string, any>;
  responseBody: Record<string, any>;
}

export const serializeReport = (doc: ReportSchema): SerializedReport => {
  return {
    ...doc,
    requestBody: JSON.parse(doc.requestBody),
    responseBody: JSON.parse(doc.responseBody),
  };
};

export const serializeGaiReport = (doc: ReportSchema): SerializedReport => {
  console.log(doc.requestBody)
  console.log(doc.responseBody)
  return {
    ...doc,
    requestBody: {"model": "gpt-3.5-turbo"},
    responseBody: {},
  };
};

export interface PaginatedReportsSchema {
  id: string;
  environment: string;
  timestamp: string;
  totalTokens: number;
  totalCost: number;
  duration: number;
  model: string;
  modelAuthor: string;
  provider: string;
  responseStatusCode: number;
  cacheEnabled: boolean;
  cacheHit: boolean;
  promptId: string;
}

export type SerializedPaginatedReport = PaginatedReportsSchema;

export const serializePaginatedReport = (
  doc: PaginatedReportsSchema
): SerializedPaginatedReport => {
  return {
    ...doc,
  };
};
