export interface ReportSchema {
  id: string;
  organizationId: string;
  projectId: string;
  environment: string;
  timestamp: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
  duration: number;
  type: string;
  client: string;
  clientVersion: string;
  model: string;
  modelAuthor: string;
  provider: string;
  requestTimestamp: string;
  requestBody: string;
  isError: number;
  responseStatusCode: number;
  responseTimestamp: string;
  responseBody: string;
  cacheEnabled: number;
  cacheHit: number;
  promptId: string;
}

export interface SerializedReport
  extends Omit<
    ReportSchema,
    "requestBody" | "isError" | "responseBody" | "cacheEnabled" | "cacheHit"
  > {
  requestBody: Record<string, any>;
  isError: boolean;
  responseBody: Record<string, any>;
  cacheEnabled: boolean;
  cacheHit: boolean;
}

export const serializeReport = (
  doc: ReportSchema
): SerializedReport => {
  return {
    ...doc,
    requestBody: JSON.parse(doc.requestBody),
    isError: doc.isError === 1,
    responseBody: JSON.parse(doc.responseBody),
    cacheEnabled: doc.cacheEnabled === 1,
    cacheHit: doc.cacheHit === 1,
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
  cacheEnabled: number;
  cacheHit: number;
  promptId: string;
}

export interface SerializedPaginatedReport extends Omit<PaginatedReportsSchema, "cacheEnabled" | "cacheHit"> {
  cacheEnabled: boolean;
  cacheHit: boolean;
}

export const serializePaginatedReport = (
  doc: PaginatedReportsSchema
): SerializedPaginatedReport => {
  return {
    ...doc,
    cacheEnabled: doc.cacheEnabled === 1,
    cacheHit: doc.cacheHit === 1,
  };
};
