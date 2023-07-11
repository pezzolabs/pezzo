export interface RequestReportItem {
  key: string;
  timestamp: string;
  status: JSX.Element;
  request: string;
  response: JSX.Element;
  latency: string;
  totalTokens?: number;
  cost?: string;
}
