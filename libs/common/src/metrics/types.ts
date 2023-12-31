export type ExeceutionTypeChartResultDataType = {
  timestamp: string;
  value: number;
}[];

export type SuccessErrorRateResultDataType = {
  timestamp: string;
  success: number;
  error: number;
  total: number; 
}[];

export type ModelUsageResultDataType = {
  timestamp: string;
  model: string;
  modelAuthor: string;
  value: string;
}[];