import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import {
  GET_ALL_PROVIDER_API_KEYS,
  GET_CURRENT_PEZZO_API_KEY,
} from "../../graphql/queries/api-keys";
import { GET_ALL_PROMPTS } from "../../graphql/queries/prompts";

export const useApiKeys = () =>
  useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => gqlClient.request(GET_CURRENT_PEZZO_API_KEY),
  });

export const useProviderApiKeys = () =>
  useQuery({
    queryKey: ["providerApiKeys"],
    queryFn: () => gqlClient.request(GET_ALL_PROVIDER_API_KEYS),
  });

export const useGetPrompts = () =>
  useQuery({
    queryKey: ["prompts"],
    queryFn: () => gqlClient.request(GET_ALL_PROMPTS),
  });
