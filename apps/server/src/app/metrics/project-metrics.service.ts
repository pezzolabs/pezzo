import { Injectable } from "@nestjs/common";
import { ProjectMetricType } from "./inputs/get-project-metrics.input";
import { OpenSearchService } from "../opensearch/opensearch.service";
import { HistogramMetric, ProjectMetric } from "./models/project-metric.model";
import {
  buildBaseProjectMetricQuery,
  getMetricHistogramParams,
  getStartAndEndDates,
} from "./metrics.utils";
import { OpenSearchIndex } from "../opensearch/types";

@Injectable()
export class ProjectMetricsService {
  constructor(private openSearchService: OpenSearchService) {}

  async getRequests(
    projectId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate),
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
    endDate: Date
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      const query = {
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          aggs: {
            total_cost: {
              sum: {
                field: "calculated.totalCost",
              },
            },
          },
        }),
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
    endDate: Date
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          aggs: {
            avg_duration: {
              avg: {
                field: "calculated.duration",
              },
            },
          },
        }),
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
    endDate: Date
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          query: {
            bool: {
              filter: [
                {
                  term: {
                    "response.status": 200,
                  },
                },
              ],
            },
          },
        }),
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
    endDate: Date
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(startDate, endDate);

    const buildAndExecuteQuery = async (startDate: string, endDate: string) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          query: {
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
        }),
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
    bucketSize: string
  ): Promise<HistogramMetric[]> {
    const { aggregation, filters = [] } = getMetricHistogramParams(metricType);

    const result = await this.openSearchService.client.search({
      index: OpenSearchIndex.Requests,
      body: {
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
              ...filters,
            ],
          },
        },
        aggs: {
          metrics_over_time: {
            date_histogram: {
              field: "timestamp",
              interval: bucketSize,
              extended_bounds: {
                min: startDate.toISOString(),
                max: endDate.toISOString(),
              },
            },
            aggs: {
              metric_value: aggregation,
            },
          },
        },
        size: 0,
      },
    });

    // Convert the response to the HistogramMetric format
    const buckets = result.body.aggregations.metrics_over_time.buckets;

    return buckets.map((bucket) => ({
      date: bucket.key_as_string,
      value: parseInt(bucket.metric_value.value || 0),
    }));
  }
}
