import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { BASE_API_URL } from "../../env";

export const gqlClient = new GraphQLClient(`${BASE_API_URL}/graphql`, {
  credentials: "include",
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
  },
});
