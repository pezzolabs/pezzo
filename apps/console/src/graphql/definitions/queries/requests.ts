import { graphql } from "~/@generated/graphql";

export const GET_ALL_REQUESTS = graphql(/* GraphQL */ `
  query PaginatedRequests($data: GetRequestsInput!) {
    paginatedRequests(data: $data) {
      data
      pagination {
        offset
        limit
        total
      }
    }
  }
`);

export const GET_REPORT = graphql(/* GraphQL */ `
  query GetReport($data: GetReportInput!) {
    report(data: $data)
  }
`);
