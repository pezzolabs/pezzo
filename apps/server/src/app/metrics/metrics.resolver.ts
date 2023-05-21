import { Args, Query, Resolver } from "@nestjs/graphql";
import { Metric } from "./models/metric.model";
import { InfluxDbService } from "../influxdb/influxdb.service";
import { InfluxQueryResult } from "./types";
import { GetMetricsInput, Granularity } from "./inputs/get-metrics.input";
import { AuthGuard } from "../auth/auth.guard";
import { InternalServerErrorException, NotFoundException, UseGuards } from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { PromptsService } from "../prompts/prompts.service";
import { Prompt } from "@prisma/client";

interface PromptExecutionQueryResult extends InfluxQueryResult {
  prompt_id: string;
  prompt_version_sha: string;
  prompt_integration_id: string;
  prompt_name: string;
}

const granularityMapping = {
  [Granularity.hour]: "1h",
  [Granularity.day]: "1d",
  [Granularity.week]: "1w",
  [Granularity.month]: "1mo",
};

@UseGuards(AuthGuard)
@Resolver(() => Metric)
export class MetricsResolver {
  constructor(
    private influxService: InfluxDbService,
    private promptService: PromptsService,
    private readonly logger: PinoLogger,
  ) {}

  @Query(() => [Metric])
  async metrics(
    @Args("data") data: GetMetricsInput,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.assign({ data })
    this.logger.info('Getting metrics');

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

    isProjectMemberOrThrow(user, prompt.projectId);
    const queryClient = this.influxService.getQueryApi("primary");

    const {
      start,
      stop,
      field,
      aggregation,
      granularity,
      promptId,
      fillEmpty,
    } = data;

    let query = `from(bucket: "primary")
    |> range(start: ${start}, stop: ${stop})
    |> filter(fn: (r) => r["_measurement"] == "prompt_execution")
    |> filter(fn: (r) => r["prompt_id"] == "${promptId}")
    |> filter(fn: (r) => r["_field"] == "${field}")
    `;

    query += `|> aggregateWindow(every: ${
      granularityMapping[granularity]
    }, fn: ${aggregation}, createEmpty: ${fillEmpty ? "true" : "false"})`;

    if (fillEmpty) {
      query += `|> fill(value: ${fillEmpty})`;
    }

    const queryResults: InfluxQueryResult[] = await queryClient.collectRows(
      query
    );

    return queryResults.map((r: PromptExecutionQueryResult) => ({
      value: r._value,
      time: new Date(r._time),
      metadata: {
        prompt_version_sha: r.prompt_version_sha,
      },
    }));
  }
}
