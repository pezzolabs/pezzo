import { ProjectMetricHistogramBucketSize } from "../inputs/get-project-metrics.input";
import {
  generateBucketsSubquery,
  timePropertiesFromBucketSize,
} from "./queries.utils";
import { Knex } from "knex";

export const modelUsageQuery = (
  knex: Knex,
  params: {
    projectId: string;
    bucketSize: ProjectMetricHistogramBucketSize;
    column: string;
    startDate: Date;
    endDate: Date;
  }
): Knex.QueryBuilder => {
  const { projectId, bucketSize, column, startDate, endDate } = params;

  const timeProps = timePropertiesFromBucketSize(bucketSize);
  const bucketsSubquery = generateBucketsSubquery(knex, {
    startDate,
    endDate,
    timeProps,
  });

  const mainquery = knex
    .select({
      timestamp: "s.timeframe",
      values: knex.raw(`
      if(
        arrayReduce('sumMap', arrayMap((model, duration) -> map(model, duration), groupArray(r.model), groupArray(r.duration))) = map('', 0), 
        NULL, 
        toJSONString(arrayReduce('sumMap', arrayMap((model, duration) -> map(model, duration), groupArray(r.model), groupArray(r.duration))))
       )
    `),
    })
    .from(bucketsSubquery)
    .leftJoin("reports as r", (join) =>
      join.on(
        knex.raw(
          `${timeProps.roundFn}(r."request.timestamp") = s.timeframe AND r."projectId" = '${projectId}'`
        )
      )
    )
    .groupBy(["s.timeframe"])
    .orderBy(["s.timeframe"]);

  return mainquery;
};
