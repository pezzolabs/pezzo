import { graphql } from "~/@generated/graphql";

export const GET_GENERIC_PROJECT_METRIC_HISTOGRAM = graphql(/* GraphQL */ `
  query getGenericProjectMetricHistogram(
    $data: GetProjectGenericHistogramInput!
  ) {
    genericProjectMetricHistogram(data: $data) {
      data
    }
  }
`);

export const GET_PROJECT_METRIC_DELTA = graphql(/* GraphQL */ `
  query getProjectMetricDelta($data: GetProjectMetricDeltaInput!) {
    projectMetricDelta(data: $data) {
      currentValue
      previousValue
    }
  }
`);
