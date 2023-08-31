import { Injectable } from "@nestjs/common";
import { ProjectMetricTimeframe } from "./inputs/get-project-metrics.input";
import { OpenSearchService } from "../opensearch/opensearch.service";
import { ProjectMetric } from "./models/project-metric.model";
import {
  buildBaseProjectMetricQuery,
  getStartAndEndDates,
} from "./metrics.utils";
import { OpenSearchIndex } from "../opensearch/types";

@Injectable()
export class ProjectMetricsService {
  constructor(private openSearchService: OpenSearchService) {}

  async getRequests(
    projectId: string,
    timeframe: ProjectMetricTimeframe
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(timeframe);

    const buildAndExecuteQuery = async (startDate: Date, endDate: Date) => {
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
    timeframe: ProjectMetricTimeframe
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(timeframe);

    const buildAndExecuteQuery = async (startDate: Date, endDate: Date) => {
      const result = await this.openSearchService.client.search({
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
      });

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
    timeframe: ProjectMetricTimeframe
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(timeframe);

    const buildAndExecuteQuery = async (startDate: Date, endDate: Date) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          aggs: {
            avg_duration: {
              avg: {
                field: "calculated.duration"
              }
            }
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
    timeframe: ProjectMetricTimeframe
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(timeframe);

    const buildAndExecuteQuery = async (startDate: Date, endDate: Date) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          query: {
            bool: {
              filter: [
                {
                  term: {
                    "response.status": 200,
                  }
                }
              ]
            }
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
    timeframe: ProjectMetricTimeframe
  ): Promise<ProjectMetric> {
    const { current, previous } = getStartAndEndDates(timeframe);

    const buildAndExecuteQuery = async (startDate: Date, endDate: Date) => {
      const result = await this.openSearchService.client.search({
        index: OpenSearchIndex.Requests,
        body: buildBaseProjectMetricQuery(projectId, startDate, endDate, {
          query: {
            bool: {
              must_not: [
                {
                  term: {
                    "response.status": 200,
                  }
                }
              ]
            }
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
}
