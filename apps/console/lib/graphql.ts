import {
QueryClient,
} from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_BASE_API_URL;

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000
    },
  }
});