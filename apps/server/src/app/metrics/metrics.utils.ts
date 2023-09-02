import { MsearchBody } from "@opensearch-project/opensearch/api/types";
import { ProjectMetricType } from "./inputs/get-project-metrics.input";

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
  startDate: string,
  endDate: string,
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
                gte: startDate,
                lte: endDate,
              },
            },
          },
          ...((options?.query?.bool?.filter as any[]) || []),
        ],
        must_not: [...((options?.query?.bool?.must_not as any[]) || [])],
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
    startDate: string;
    endDate: string;
  };
  previous: {
    startDate: string;
    endDate: string;
  };
};

export function getStartAndEndDates(
  startDate: Date,
  endDate: Date
): IntervalDates {
  const diff = endDate.getTime() - startDate.getTime();

  const previousStartDate = new Date(startDate.getTime() - diff);
  const previousEndDate = new Date(endDate.getTime() - diff);

  return {
    current: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    previous: {
      startDate: previousStartDate.toISOString(),
      endDate: previousEndDate.toISOString(),
    },
  };
}

export function getMetricHistogramParams(metric: ProjectMetricType): {
  aggregation: any;
  filters?: any[];
} {
  switch (metric) {
    case ProjectMetricType.requests:
      return {
        aggregation: {
          value_count: {
            field: "timestamp",
          },
        },
      };
    case ProjectMetricType.duration:
      return {
        aggregation: {
          avg: {
            field: "calculated.duration",
          },
        },
      };
    case ProjectMetricType.erroneousRequests:
      return {
        aggregation: {
          value_count: {
            field: "timestamp",
          },
        },
        filters: [
          {
            bool: {
              must_not: [
                {
                  term: {
                    "response.status": 200,
                  },
                },
              ],
            },
          },
        ],
      };

    default:
      throw new Error("Invalid metric");
  }
}
