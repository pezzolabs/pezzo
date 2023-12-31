import { Knex } from "knex";
import { ProjectMetricHistogramBucketSize } from "../inputs/get-project-metrics.input";

interface TimeProps {
  roundFn: string;
  interval: string;
}

export const timePropertiesFromBucketSize = (
  bucketSize: ProjectMetricHistogramBucketSize
): TimeProps => {
  switch (bucketSize) {
    case ProjectMetricHistogramBucketSize.minutely:
      return { roundFn: "toStartOfMinute", interval: "minute" };
    case ProjectMetricHistogramBucketSize.hourly:
      return { roundFn: "toStartOfHour", interval: "hour" };
    case ProjectMetricHistogramBucketSize.daily:
      return { roundFn: "toStartOfDay", interval: "day" };
    case ProjectMetricHistogramBucketSize.weekly:
      return { roundFn: "toStartOfWeek", interval: "day" };
    case ProjectMetricHistogramBucketSize.monthly:
      return { roundFn: "toStartOfMonth", interval: "month" };
  }
};

export const generateBucketsSubquery = (
  knex: Knex,
  params: {
    startDate: Date;
    endDate: Date;
    timeProps: TimeProps;
  }
): Knex.QueryBuilder => {
  const { startDate, endDate, timeProps } = params;

  const subquery = knex
    .select(
      knex.raw(
        `${timeProps.roundFn}(parseDateTimeBestEffort(?) + INTERVAL number hour) AS timestamp`,
        [startDate]
      )
    )
    .from(
      knex.raw(
        "numbers(dateDiff('hour', parseDateTimeBestEffort(?), parseDateTimeBestEffort(?)) + 1)",
        [startDate, endDate]
      )
    );

  return subquery;
};
