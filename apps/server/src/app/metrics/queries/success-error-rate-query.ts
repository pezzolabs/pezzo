import { ProjectMetricHistogramBucketSize } from "../inputs/get-project-metrics.input";
import {
  generateBucketsSubquery,
  timePropertiesFromBucketSize,
} from "./queries.utils";
import { Knex } from "knex";

export const successErrorRateQuery = (
  knex: Knex,
  params: {
    projectId: string;
    bucketSize: ProjectMetricHistogramBucketSize;
    startDate: Date;
    endDate: Date;
  }
): Knex.QueryBuilder => {
  const { projectId, bucketSize, startDate, endDate } = params;

  const timeProps = timePropertiesFromBucketSize(bucketSize);
  const bucketsSubquery = generateBucketsSubquery(knex, {
    startDate,
    endDate,
    timeProps,
  });

  const mainquery = knex
    .with("buckets", bucketsSubquery)
    .select({
      timestamp: "b.timestamp",
      requests: knex.raw(
        `countIf(${timeProps.roundFn}(r.requestTimestamp) = timestamp)`
      ),
      error: knex.raw(
        `countIf(r.isError = true AND ${timeProps.roundFn}(r.requestTimestamp) = timestamp)`
      ),
      success: knex.raw(
        `countIf(r.isError = false AND ${timeProps.roundFn}(r.requestTimestamp) = timestamp)`
      ),
    })
    .from("buckets as b")
    .leftJoin("reports as r", (join) =>
      join.on(
        knex.raw(
          `${timeProps.roundFn}(r.requestTimestamp) = b.timestamp AND r."projectId" = '${projectId}'`
        )
      )
    )
    .groupBy("timestamp")
    .orderBy("timestamp");

  return mainquery;
};
