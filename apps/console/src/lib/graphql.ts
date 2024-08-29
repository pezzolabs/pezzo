import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { BASE_API_URL } from "~/env";
import { signOut } from "./utils/sign-out";

let email: string | null = null;
const oktaUrl = "/oauth2/userinfo";
export const getOktaUserInfo = async () => {
  if (!sessionStorage.getItem("email")) {
    fetch(oktaUrl, {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        res.json().then((resp) => {
          // console.log("email: " + resp.email);
          email = resp.email;
          sessionStorage.setItem("email", email);
        });
      } else {
        console.error(`error message: ${res.text()}`);
      }
    });
  }
}

export const gqlClient = new GraphQLClient(`${BASE_API_URL}/graphql`, {
  credentials: "include",
  // headers: {
  //   "user": user,
  // },
  fetch: async (url, options) => {
    await getOktaUserInfo();
    options.headers = {
      ...options.headers,
      "email": sessionStorage.getItem("email") || email,
    }
    // console.log("===header: " + JSON.stringify(options.headers));
    const res = await fetch(url, options);
    // console.log("response status: " + res.status);
    const json = await res.clone().json();
    // console.log("response json: " + JSON.stringify(json));

    if (json.errors && json.errors.length > 0) {
      // Check if auth error
      if (json.errors[0].extensions?.code === "UNAUTHORIZED") {
        await signOut();
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
