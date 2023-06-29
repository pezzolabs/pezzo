import { graphql } from "../../../../@generated/graphql";

export const GET_ALL_REQUESTS = graphql(/* GraphQL */ `
  query requestReports($data: GetRequestsInput!) {
    requestReports(data: $data) {
      reportId
      request
      response
      calculated
      properties
      metadata
      type
    }
  }
`);
