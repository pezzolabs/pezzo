import { graphql } from "../../../../@generated/graphql";

export const GET_PROMPT_EXECUTION_METRICS = graphql(/* GraphQL */ `
  query getMetrics($data: GetMetricsInput!) {
    metrics(data: $data) {
      value
      time
    }
  }
`);
