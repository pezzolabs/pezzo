import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { BASE_API_URL } from "~/env";
import { attemptRefreshingSession } from "supertokens-auth-react/recipe/session";
import { signOut } from "./utils/sign-out";

export const gqlClient = new GraphQLClient(`https://${BASE_API_URL}/graphql`, {
  credentials: "include",
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  // },
  fetch: async (url, options) => {
    const res = await fetch(url, options);
    const json = await res.clone().json();

    if (json.errors && json.errors.length > 0) {
      // Check if auth error
      if (json.errors[0].extensions?.code === "UNAUTHORIZED") {
        // Attempt to refresh the session
        const isSuccessful = await attemptRefreshingSession();

        if (!isSuccessful) {
          await signOut();
          return;
        }

        // Retry request
        return fetch(url, options);
      }
    }

    return res;
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      suspense: true,
    },
  },
});
