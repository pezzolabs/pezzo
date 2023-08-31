import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { gqlClient } from "../../lib/graphql";
import {
  GET_ALL_API_KEYS,
  GET_ALL_PROVIDER_API_KEYS,
} from "../definitions/queries/api-keys";
import { GET_ME } from "../definitions/queries/users";
import { GET_ALL_PROJECTS } from "../definitions/queries/projects";
import { useCurrentOrganization } from "../../lib/hooks/useCurrentOrganization";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { GET_ALL_REQUESTS } from "../definitions/queries/requests";
import {
  GetProjectMetricQuery,
  GetPromptQuery,
  GetPromptVersionQuery,
  Pagination,
  ProjectMetricTimeframe,
  ProjectMetricType,
  RequestReport,
} from "../../../@generated/graphql/graphql";
import { GraphQLErrorResponse, ReportRequestResponse } from "../types";
import { Provider } from "@pezzo/types";
import { GET_PROMPT, GET_PROMPT_VERSION } from "../definitions/queries/prompts";
import { useEffect } from "react";
import { useFiltersAndSortParams } from "../../lib/hooks/useFiltersAndSortParams";
import { GET_PROJECT_METRIC } from "../definitions/queries/metrics";

export const useProviderApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["providerApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROVIDER_API_KEYS, {
        data: { organizationId: organization?.id },
      }),
  });
};

export const usePezzoApiKeys = () => {
  const { organization } = useCurrentOrganization();

  return useQuery({
    queryKey: ["pezzoApiKeys", organization?.id],
    queryFn: () =>
      gqlClient.request(GET_ALL_API_KEYS, {
        data: { organizationId: organization?.id },
      }),
  });
};

export const useGetCurrentUser = () =>
  useQuery({ queryKey: ["me"], queryFn: () => gqlClient.request(GET_ME) });

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

const buildTypedRequestReportObject = (requestReport: RequestReport) => {
  switch (requestReport.metadata.providers) {
    case Provider.OpenAI:
      return requestReport as ReportRequestResponse<Provider.OpenAI>;
    default:
      return requestReport as ReportRequestResponse<Provider.OpenAI>;
  }
};

export const useGetRequestReports = ({
  size = 10,
  page = 1,
}: {
  size: number;
  page: number;
}) => {
  const { project } = useCurrentProject();
  const { filters, sort } = useFiltersAndSortParams();

  const { refetch, ...response } = useQuery({
    queryKey: ["requestReports", project?.id, page, size, filters, sort],
    queryFn: () =>
      gqlClient.request<{
        paginatedRequests: { pagination: Pagination; data: RequestReport[] };
      }>(GET_ALL_REQUESTS, {
        data: { projectId: project?.id, size, page, filters, sort },
      }),
    enabled: !!project,
  });

  const typedData =
    response.data?.paginatedRequests.data?.map(buildTypedRequestReportObject) ??
    [];

  useEffect(() => {
    refetch();
  }, [refetch, sort, filters]);

  return {
    ...response,
    refetch,
    data: {
      ...response.data,
      paginatedRequests: {
        ...response.data?.paginatedRequests,
        data: typedData,
      },
    },
  };
};

export const useProjectMetric = (
  metric: ProjectMetricType,
  timeframe: ProjectMetricTimeframe,
  options: UseQueryOptions<GetProjectMetricQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["projectMetric", project?.id, metric, timeframe],
    queryFn: () =>
      gqlClient.request(GET_PROJECT_METRIC, {
        data: {
          projectId: project?.id,
          metric,
          timeframe,
        },
      }),
    ...options,
  });

  return { ...result, metric: result.data?.projectMetric };
};
