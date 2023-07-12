import { RequestReport } from "../../reporting/object-types/request-report.model";

export type FilterFields<TMainKey extends keyof RequestReport> =
  RequestReport[TMainKey] extends Record<never, never>
    ? keyof RequestReport[TMainKey] extends string
      ? `${TMainKey}.${keyof RequestReport[TMainKey]}`
      : `${TMainKey}`
    : `${TMainKey}`;

export type RequestReportFilterFields = FilterFields<keyof RequestReport>;
