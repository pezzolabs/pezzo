import { graphql } from "../../../../@generated/graphql";

export const GET_PROMPT_EXECUTION_METRICS = graphql(/* GraphQL */ `
  query getMetrics($data: GetPromptMetricsInput!) {
    metrics(data: $data) {
      value
      time
    }
  }
`);

export const GET_PROJECT_METRIC = graphql(/* GraphQL */ `
  query getProjectMetric($data: GetProjectMetricInput!) {
    projectMetric(data: $data) {
      currentValue
      previousValue
    }
  }
`);
