import bodybuilder from "bodybuilder";

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
  body: bodybuilder.Bodybuilder,
  projectId: string,
  startDate: string,
  endDate: string
): bodybuilder.Bodybuilder {
  return body
    .filter("term", "ownership.projectId", projectId)
    .filter("range", "timestamp", { gte: startDate, lte: endDate })
    .size(0);
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
