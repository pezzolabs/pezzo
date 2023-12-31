import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import {
  DeltaMetricType,
  HistogramIdType,
  ProjectMetricHistogramBucketSize,
} from "./inputs/get-project-metrics.input";
import {
  GenericProjectHistogramResult,
  ProjectMetricDeltaResult,
} from "./models/project-metric.model";
import { FilterInput } from "../common/filters/filter.input";
import { ClickHouseService } from "../clickhouse/clickhouse.service";
import { averageRequestDurationQuery } from "./queries/average-request-duration-query";
import { Knex } from "knex";
import { successErrorRateQuery } from "./queries/success-error-rate-query";

@Injectable()
export class ProjectMetricsService {
  constructor(
    private clickHouseService: ClickHouseService
  ) {}

  async getGenericHistogram(
    projectId: string,
    histogramId: HistogramIdType,
    startDate: Date,
    endDate: Date,
    bucketSize: ProjectMetricHistogramBucketSize,
    filters: FilterInput[]
  ): Promise<GenericProjectHistogramResult> {
    let queryBuilder: Knex.QueryBuilder;

    switch (histogramId) {
      case HistogramIdType.requestDuration:
        queryBuilder = averageRequestDurationQuery(
          this.clickHouseService.knex,
          { projectId, bucketSize, startDate, endDate }
        );
        break;
      case HistogramIdType.successErrorRate:
        queryBuilder = successErrorRateQuery(this.clickHouseService.knex, {
          projectId,
          bucketSize,
          startDate,
          endDate,
        });
        break;
      default:
        throw new BadRequestException(
          `HistogramId ${histogramId} is not supported`
        );
    }

    const result = await queryBuilder;
    return { data: result };
  }

  async getProjectMetricDelta(
    projectId: string,
    startDate: Date,
    endDate: Date,
    metric: DeltaMetricType
  ): Promise<ProjectMetricDeltaResult> {
    let selectStatement: string;

    switch (metric) {
      case DeltaMetricType.AverageRequestDuration:
        selectStatement = /*sql*/ `
          avgIf(r.duration, r.isError = false AND r.requestTimestamp >= currentStartDate AND r.responseTimestamp <= currentEndDate) AS currentValue,
          avgIf(r.duration, r.isError = false AND r.requestTimestamp >= previousStartDate AND r.responseTimestamp <= previousEndDate) AS previousValue
        `;
        break;
      case DeltaMetricType.TotalRequests:
        selectStatement = /*sql*/ `
          countIf(r.requestTimestamp >= currentStartDate AND r.responseTimestamp <= currentEndDate) AS currentValue,
          countIf(r.requestTimestamp >= previousStartDate AND r.responseTimestamp <= previousEndDate) AS previousValue
        `;
        break;
      case DeltaMetricType.TotalCost:
        selectStatement = /*sql*/ `
          sumIf(r.totalCost, r.requestTimestamp >= currentStartDate AND r.responseTimestamp <= currentEndDate) AS currentValue,
          sumIf(r.totalCost, r.requestTimestamp >= previousStartDate AND r.responseTimestamp <= previousEndDate) AS previousValue
        `;
        break;
      case DeltaMetricType.SuccessResponses:
        selectStatement = /*sql*/ `
          countIf(r.isError = false AND r.requestTimestamp >= currentStartDate AND r.responseTimestamp <= currentEndDate) AS currentSuccess,
          countIf(r.isError = false AND r.requestTimestamp >= previousStartDate AND r.responseTimestamp <= previousEndDate) AS previousSuccess,
          countIf(r.requestTimestamp >= currentStartDate AND r.responseTimestamp <= currentEndDate) AS currentTotal,
          countIf(r.requestTimestamp >= previousStartDate AND r.responseTimestamp <= previousEndDate) AS previousTotal,
          if(currentTotal = 0, 0, (currentSuccess / currentTotal)) as currentValue,
          if(previousTotal = 0, 0, (previousSuccess / previousTotal)) as previousValue
        `;
        break;
      default:
        throw new BadRequestException(`Metric ${metric} is not supported`);
    }

    const query = /*sql*/ `
      WITH (
        parseDateTimeBestEffort('${startDate.toISOString()}') AS currentStartDate,
        parseDateTimeBestEffort('${endDate.toISOString()}') AS currentEndDate,
        datediff(second, currentStartDate, currentEndDate) AS diff,
        subtractSeconds(currentStartDate, diff) AS previousStartDate,
        subtractSeconds(currentEndDate, diff) AS previousEndDate
      )
      SELECT
          ${selectStatement}
      FROM
          reports r
      WHERE
          projectId = '${projectId}'
    `;

    try {
      const result = await this.clickHouseService.knex.raw(query);
      const data = result[0][0];

      return {
        currentValue: data.currentValue,
        previousValue: data.previousValue,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Failed to get metric delta`);
    }
  }
}
