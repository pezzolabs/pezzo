import { MsearchBody } from "@opensearch-project/opensearch/api/types";
import { ProjectMetricTimeframe } from "./inputs/get-project-metrics.input";

export function getPercentageChange(
  currentValue: number,
  previousValue: number
) {
  if (previousValue === 0) {
    return 0;
  }

  return Math.ceil(((currentValue - previousValue) / previousValue) * 100);
}

export function buildBaseProjectMetricQuery(
  projectId: string,
  startDate: Date,
  endDate: Date,
  options: Partial<MsearchBody> = {}
) {
  const body: MsearchBody = {
    query: {
      bool: {
        filter: [
          {
            term: {
              "ownership.projectId": projectId,
            },
          },
          {
            range: {
              timestamp: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
              },
            },
          },
          ...(options?.query?.bool?.filter as any[] || []),
        ],
        must_not: [
          ...(options?.query?.bool?.must_not as any[] || []),
        ]
      },
    },
    size: 0,
  };

  if (options.aggs) {
    body.aggs = options.aggs;
  }

  return body;
}

type IntervalDates = {
  current: {
    startDate: Date;
    endDate: Date;
  };
  previous: {
    startDate: Date;
    endDate: Date;
  };
};

export function getStartAndEndDates(
  timeframe: ProjectMetricTimeframe
): IntervalDates {
  const endDate = new Date();
  let startDate: Date;

  switch (timeframe) {
    case ProjectMetricTimeframe.daily:
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 1
      );
      break;
    case ProjectMetricTimeframe.weekly:
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 7
      );
      break;
    case ProjectMetricTimeframe.monthly:
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 1,
        endDate.getDate()
      );
      break;

    default:
      throw new Error("Unsupported interval");
  }

  // Calculate previous interval dates based on current interval's start and end dates
  const previousIntervalStartDate = new Date(startDate);
  const previousIntervalEndDate = new Date(endDate);

  const dateDifference =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  previousIntervalStartDate.setDate(startDate.getDate() - dateDifference);
  previousIntervalEndDate.setDate(endDate.getDate() - dateDifference);

  return {
    current: {
      startDate: startDate,
      endDate: endDate,
    },
    previous: {
      startDate: previousIntervalStartDate,
      endDate: previousIntervalEndDate,
    },
  };
}
