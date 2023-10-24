import { graphql } from "~/@generated/graphql";

export const GET_ALL_REQUESTS = graphql(/* GraphQL */ `
  query PaginatedRequests($data: GetRequestsInput!) {
    paginatedRequests(data: $data) {
      data {
        reportId
        request
        response
        calculated
        properties
        metadata
        cacheEnabled
        cacheHit
      }
      pagination {
        page
        size
        total
      }
    }
  }
`);
