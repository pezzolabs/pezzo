import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { BASE_API_URL } from "~/env";
import { signOut } from "./utils/sign-out";



export const gqlClient = new GraphQLClient(`https://${BASE_API_URL}/graphql`, {
  credentials: "include",
  // headers: {
  //   "user": user,
  // },
  fetch: async (url, options) => {
    // getOktaUserInfo();
    options.headers = {
      ...options.headers,
    }
    console.log("===header: " + JSON.stringify(options.headers));
    const res = await fetch(url, options);
    // console.log("response status: " + res.status);
    const json = await res.clone().json();
    console.log("response json: " + JSON.stringify(json));

    if (json.errors && json.errors.length > 0) {
      // Check if auth error
      if (json.errors[0].extensions?.code === "UNAUTHORIZED") {
        // Attempt to refresh the session
        // const isSuccessful = await attemptRefreshingSession();

        // if (!isSuccessful) {
        //   await signOut();
        //   return;
        // }
        // await signOut();
        return;

        // Retry request
        // return fetch(url, options);
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
