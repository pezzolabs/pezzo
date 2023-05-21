import { Args, Query, Resolver } from "@nestjs/graphql";
import { Metric } from "./models/metric.model";
import { InfluxDbService } from "../influxdb/influxdb.service";
import { InfluxQueryResult } from "./types";
import { GetMetricsInput, Granularity } from "./inputs/get-metrics.input";

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

@Resolver(() => Metric)
export class MetricsResolver {
  constructor(private influxService: InfluxDbService) {}

  @Query(() => [Metric])
  async metrics(@Args("data") data: GetMetricsInput) {
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
