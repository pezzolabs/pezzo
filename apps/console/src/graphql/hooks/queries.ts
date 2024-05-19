import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { gqlClient } from "~/lib/graphql";
import {
  GET_ALL_API_KEYS,
  GET_ALL_PROVIDER_API_KEYS,
} from "../definitions/queries/api-keys";
import {GET_ME, GET_USER} from "../definitions/queries/users";
import { GET_ALL_PROJECTS } from "../definitions/queries/projects";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { GET_ALL_REQUESTS, GET_REPORT } from "../definitions/queries/requests";
import {
  GetPromptQuery,
  GetPromptVersionQuery,
  PaginatedRequestsQuery,
  GetGenericProjectMetricHistogramQueryVariables,
  GetGenericProjectMetricHistogramQuery,
  GetProjectMetricDeltaQueryVariables,
  GetProjectMetricDeltaQuery,
  GetReportQuery,
  GetReportQueryVariables,
} from "~/@generated/graphql/graphql";
import { GraphQLErrorResponse } from "../types";
import { GET_PROMPT, GET_PROMPT_VERSION } from "../definitions/queries/prompts";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import {
  GET_GENERIC_PROJECT_METRIC_HISTOGRAM,
  GET_PROJECT_METRIC_DELTA,
} from "../definitions/queries/metrics";
import { SerializedReport } from "@pezzo/types";

export const useProviderApiKeys = () => {
  const { organization } = useCurrentOrganization();

  const result = useQuery({
    queryKey: ["providerApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROVIDER_API_KEYS, {
        data: { organizationId: organization?.id },
      }),
  });

  return { ...result, providerApiKeys: result.data?.providerApiKeys ?? [] };
};

export const usePezzoApiKeys = () => {
  const { organization } = useCurrentOrganization();

  const { data, isLoading } = useQuery({
    queryKey: ["pezzoApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_API_KEYS, {
        data: { organizationId: organization?.id },
      }),
  });

  return {
    pezzoApiKeys: data?.apiKeys,
    isLoading,
  };
};

export const useGetCurrentUser = () =>
  useQuery({ queryKey: ["me"], queryFn: () => gqlClient.request(GET_ME) });

export const useGetUserByEmail = (email: string) =>
  useQuery({ queryKey: ["getUser"], queryFn: () => gqlClient.request(GET_USER, {data: email}) });

export const useGetProjects = () => {
  const { organization } = useCurrentOrganization();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROJECTS, {
        data: { organizationId: organization?.id },
      }),
    enabled: !!organization,
  });

  return {
    projects: data?.projects,
    isLoading,
  };
};

export const useGetPrompt = (
  promptId: string,
  options: UseQueryOptions<GetPromptQuery, GraphQLErrorResponse> = {}
) => {
  const result = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () =>
      gqlClient.request(GET_PROMPT, {
        data: { promptId },
      }),
    ...options,
  });

  return { ...result, prompt: result.data?.prompt };
};

export const useGetPromptVersion = (
  {
    promptId,
    promptVersionSha,
  }: { promptId: string; promptVersionSha: string },
  options: UseQueryOptions<GetPromptVersionQuery, GraphQLErrorResponse> = {}
) => {
  const result = useQuery({
    queryKey: ["prompt", promptId, "version", promptVersionSha],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_VERSION, {
        data: { sha: promptVersionSha },
      }),
    ...options,
  });

  return { ...result, promptVersion: result.data?.promptVersion };
};

export const useGetRequestReports = (
  {
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  },
  { enabled = true }: UseQueryOptions
) => {
  const { projectId } = useCurrentProject();
  const { filters, sort } = useFiltersAndSortParams();

  return useQuery<PaginatedRequestsQuery, GraphQLErrorResponse>({
    queryFn: () =>
      gqlClient.request(GET_ALL_REQUESTS, {
        data: { projectId, offset, limit, filters, sort },
      }),
    queryKey: ["requests", projectId, offset, limit, filters, sort],
    enabled,
  });
};

export const useReport = (
  data: GetReportQueryVariables["data"],
  options: UseQueryOptions<GetReportQuery, GraphQLErrorResponse> = {}
) => {
  const result = useQuery({
    queryKey: ["report", data.reportId],
    queryFn: () =>
      gqlClient.request(GET_REPORT, {
        data,
      }),
    ...options,
  });

  return { ...result, report: result.data?.report as SerializedReport };
};

export const useGenericProjectMetricHistogram = <T>(
  data: GetGenericProjectMetricHistogramQueryVariables["data"],
  options: UseQueryOptions<
    GetGenericProjectMetricHistogramQuery,
    GraphQLErrorResponse
  > = {}
) => {
  const result = useQuery({
    queryKey: ["genericProjectMetricHistogram", ...Object.values(data)],
    queryFn: () =>
      gqlClient.request(GET_GENERIC_PROJECT_METRIC_HISTOGRAM, {
        data,
      }),
    ...options,
  });

  return {
    ...result,
    histogram: result.data?.genericProjectMetricHistogram as { data: T },
  };
};

export const useProjctMetricDelta = (
  data: GetProjectMetricDeltaQueryVariables["data"],
  options: UseQueryOptions<
    GetProjectMetricDeltaQuery,
    GraphQLErrorResponse
  > = {}
) => {
  const result = useQuery({
    queryKey: ["projectMetricDelta", ...Object.values(data)],
    queryFn: () =>
      gqlClient.request(GET_PROJECT_METRIC_DELTA, {
        data,
      }),
    ...options,
  });

  return { ...result, data: result.data?.projectMetricDelta };
};
