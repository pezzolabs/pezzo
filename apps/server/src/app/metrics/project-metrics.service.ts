import { Injectable } from "@nestjs/common";
import { ProjectMetricType } from "./inputs/get-project-metrics.input";
import { OpenSearchService } from "../opensearch/opensearch.service";
import { HistogramMetric, ProjectMetric } from "./models/project-metric.model";
import {
  buildBaseProjectMetricQuery,
  getStartAndEndDates,
} from "./metrics.utils";
import { OpenSearchIndex } from "../opensearch/types";
import { FilterInput } from "../common/filters/filter.input";
import { mapFiltersToDql } from "../reporting/utils/dql-utils";

@Injectable()
export class ProjectMetricsService {
  constructor(private openSearchService: OpenSearchService) {}

  async getRequests(
    projectId: string,
    startDate: Date,
    endDate: Date,
    filters: FilterInput[]
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      let body = mapFiltersToDql({ filters, restrictions: {} });
      body = buildBaseProjectMetricQuery(body, projectId, startDate, endDate);

      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: body.build(),
      });

      return result.body.hits.total.value || 0;
    };

    const [currentRequestCount, previousRequestCount] = await Promise.all([
      buildAndExecuteQuery(current.startDate, current.endDate),
      buildAndExecuteQuery(previous.startDate, previous.endDate),
    ]);

    return {
      currentValue: currentRequestCount,
      previousValue: previousRequestCount,
    };
  }

  async getCost(
    projectId: string,
    startDate: Date,
    endDate: Date,
    filters: FilterInput[]
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      let body = mapFiltersToDql({ filters, restrictions: {} });
      body = buildBaseProjectMetricQuery(
        body,
        projectId,
        startDate,
        endDate
      ).aggregation("sum", "calculated.totalCost", "total_cost");

      const query = {
        index: OpenSearchIndex.Requests,
        body: body.build(),
      };

      const result = await this.openSearchService.client.search(query);

      return result.body.aggregations.total_cost.value || 0;
    };

    const [currentRequestCount, previousRequestCount] = await Promise.all([
      buildAndExecuteQuery(current.startDate, current.endDate),
      buildAndExecuteQuery(previous.startDate, previous.endDate),
    ]);

    return {
      currentValue: parseFloat(currentRequestCount.toFixed(5)),
      previousValue: parseFloat(previousRequestCount.toFixed(5)),
    };
  }

  async getAvgDuration(
    projectId: string,
    startDate: Date,
    endDate: Date,
    filters: FilterInput[]
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      let body = mapFiltersToDql({ filters, restrictions: {} });
      body = buildBaseProjectMetricQuery(
        body,
        projectId,
        startDate,
        endDate
      ).aggregation("avg", "calculated.duration", "avg_duration");
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: body.build(),
      });

      return result.body.aggregations.avg_duration.value || 0;
    };

    const [currentRequestCount, previousRequestCount] = await Promise.all([
      buildAndExecuteQuery(current.startDate, current.endDate),
      buildAndExecuteQuery(previous.startDate, previous.endDate),
    ]);

    return {
      currentValue: parseInt(currentRequestCount),
      previousValue: parseInt(previousRequestCount),
    };
  }

  async getSuccessfulRequests(
    projectId: string,
    startDate: Date,
    endDate: Date,
    filters: FilterInput[]
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      let body = mapFiltersToDql({ filters, restrictions: {} });
      body = buildBaseProjectMetricQuery(
        body,
        projectId,
        startDate,
        endDate
      ).filter("term", "response.status", 200);

      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: body.build(),
      });

      return result.body.hits.total.value || 0;
    };

    const [currentRequestCount, previousRequestCount] = await Promise.all([
      buildAndExecuteQuery(current.startDate, current.endDate),
      buildAndExecuteQuery(previous.startDate, previous.endDate),
    ]);

    return {
      currentValue: parseInt(currentRequestCount),
      previousValue: parseInt(previousRequestCount),
    };
  }

  async getErroneousRequests(
    projectId: string,
    startDate: Date,
    endDate: Date,
    filters: FilterInput[]
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      let body = mapFiltersToDql({ filters, restrictions: {} });
      body = buildBaseProjectMetricQuery(
        body,
        projectId,
        startDate,
        endDate
      ).notFilter("term", "response.status", 200);

      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: body.build(),
      });

      return result.body.hits.total.value || 0;
    };

    const [currentRequestCount, previousRequestCount] = await Promise.all([
      buildAndExecuteQuery(current.startDate, current.endDate),
      buildAndExecuteQuery(previous.startDate, previous.endDate),
    ]);

    return {
      currentValue: parseInt(currentRequestCount),
      previousValue: parseInt(previousRequestCount),
    };
  }

  async getHistogram(
    projectId: string,
    metricType: ProjectMetricType,
    startDate: Date,
    endDate: Date,
    bucketSize: string,
    filters: FilterInput[]
  ): Promise<HistogramMetric[]> {
    let body = mapFiltersToDql({ filters, restrictions: {} });

    body = body
      .addFilter("term", "ownership.projectId", projectId)
      .andFilter("range", "timestamp", {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      });

    let aggType, aggField;

    switch (metricType) {
      case ProjectMetricType.requests:
        aggType = "value_count";
        aggField = "timestamp";
        break;
      case ProjectMetricType.duration:
        aggType = "avg";
        aggField = "calculated.duration";
        break;
      case ProjectMetricType.erroneousRequests:
        aggType = "value_count";
        aggField = "timestamp";
        body = body.notFilter("term", "response.status", 200);
        break;
    }

    body = body.aggregation(
      "date_histogram",
      "timestamp",
      {
        interval: bucketSize,
        extended_bounds: {
          min: startDate.toISOString(),
          max: endDate.toISOString(),
        },
      },
      "metrics_over_time",
      (agg) => agg.aggregation(aggType, aggField, "metric_value")
    );

    body = body.size(0);

    const result = await this.openSearchService.client.search({
      index: OpenSearchIndex.Requests,
      body: body.build(),
    });

    // Convert the response to the HistogramMetric format
    const buckets = result.body.aggregations.metrics_over_time.buckets;

    return buckets.map((bucket) => ({
      date: bucket.key_as_string,
      value: parseInt(bucket.metric_value.value || 0),
    }));
  }
}
