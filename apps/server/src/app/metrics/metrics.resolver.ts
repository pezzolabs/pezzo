import { Args, Query, Resolver } from "@nestjs/graphql";
import { Metric } from "./models/metric.model";
import { GetMetricsInput, Granularity } from "./inputs/get-metrics.input";
import { AuthGuard } from "../auth/auth.guard";
import {
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { PromptsService } from "../prompts/prompts.service";
import { Prompt } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { OpenSearchService } from "../opensearch/opensearch.service";
import { ApiResponse } from "@opensearch-project/opensearch/.";
import {
  MsearchBody,
  SearchResponse,
} from "@opensearch-project/opensearch/api/types";
import { OpenSearchIndex } from "../opensearch/types";

const granularityMapping = {
  [Granularity.hour]: "1h",
  [Granularity.day]: "1d",
  [Granularity.week]: "1w",
  [Granularity.month]: "1M",
};

@UseGuards(AuthGuard)
@Resolver(() => Metric)
export class MetricsResolver {
  constructor(
    private prismaService: PrismaService,
    private openSearchService: OpenSearchService,
    private promptService: PromptsService,
    private readonly logger: PinoLogger
  ) {}

  @Query(() => [Metric])
  async metrics(
    @Args("data") data: GetMetricsInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ data });
    this.logger.info("Getting metrics");

    let prompt: Prompt;

    try {
      prompt = await this.promptService.getPrompt(data.promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    const project = await this.prismaService.project.findUnique({
      where: {
        id: prompt.projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    const {
      start,
      stop,
      field,
      aggregation,
      granularity,
      promptId,
    } = data;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    let aggs: any = {};

    if (aggregation !== "count") {
      aggs = {
        field_aggregation: {
          [aggregation]: { field: `calculated.${field}` },
        },
      };
    } else {
      aggs = {
        field_aggregation: {
          value_count: {
            field: "_index",
          },
        },
      };
    }

    const body: MsearchBody = {
      query: {
        bool: {
          filter: [
            {
              term: { "metadata.promptId": promptId },
            },
            {
              range: {
                "request.timestamp": {
                  gte: start,
                  lte: stop,
                },
              },
            },
          ],
        },
      },
      size: 0,
      aggs: {
        time_buckets: {
          date_histogram: {
            field: "request.timestamp",
            interval: granularityMapping[granularity],
            extended_bounds: {
              min: start,
              max: stop,
            },
          },
          aggs,
        },
      },
    };

    const query = {
      index: OpenSearchIndex.Requests,
      body,
    };

    const osResponse: ApiResponse<SearchResponse<any>> =
      await this.openSearchService.client.search(query);

    const { aggregations } = osResponse.body;
    const metrics = aggregations.time_buckets["buckets"].map((bucket) => ({
      value: bucket.field_aggregation.value || 0,
      time: new Date(bucket.key_as_string),
    }));

    return metrics;
  }
}
