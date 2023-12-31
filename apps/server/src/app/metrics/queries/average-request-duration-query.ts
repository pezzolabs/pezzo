import { ProjectMetricHistogramBucketSize } from "../inputs/get-project-metrics.input";
import { generateBucketsSubquery, timePropertiesFromBucketSize } from "./queries.utils";
import { Knex } from "knex";

export const averageRequestDurationQuery = (
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
      value: knex.raw(`COALESCE(AVG(r.duration), 0)`),
    })
    .from("buckets as b")
    .leftJoin("reports as r", (join) =>
      join.on(knex.raw(`${timeProps.roundFn}(r.requestTimestamp) = b.timestamp AND r."projectId" = '${projectId}'`))
    )
    .groupBy("b.timestamp")
    .orderBy("b.timestamp");

  return mainquery;
};