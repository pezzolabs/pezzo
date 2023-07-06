import { graphql } from "../../../../@generated/graphql";

export const GET_ALL_REQUESTS = graphql(/* GraphQL */ `
  query PaginatedRequests($data: GetRequestsInput!) {
    paginatedRequests(data: $data) {
      data {
        reportId
        request
        response
        provider
        calculated
        properties
        metadata
        type
      }
      pagination {
        page
        size
        total
      }
    }
  }
`);
