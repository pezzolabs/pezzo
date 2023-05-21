import { useQuery } from "@tanstack/react-query";
import { GET_PROMPT_EXECUTION_METRICS } from "../../graphql/queries/metrics";
import { gqlClient } from "../graphql";
import { GetMetricsInput } from "@pezzo/graphql";

export const useGetPromptExecutionMetric = (
  queryKey: string[],
  data: GetMetricsInput
) =>
  useQuery({
    queryKey,
    queryFn: () =>
      gqlClient.request(GET_PROMPT_EXECUTION_METRICS, {
        data,
      }),
  });
