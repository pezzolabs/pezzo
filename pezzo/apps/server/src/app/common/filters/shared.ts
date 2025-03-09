import { ReportSchema } from "pezzo/libs/types/src";

export type FilterFields<TMainKey extends keyof ReportSchema> =
  ReportSchema[TMainKey] extends Record<never, never>
    ? keyof ReportSchema[TMainKey] extends string
      ? `${TMainKey}.${keyof ReportSchema[TMainKey]}`
      : `${TMainKey}`
    : `${TMainKey}`;

export type RequestReportFilterFields = FilterFields<keyof ReportSchema>;
