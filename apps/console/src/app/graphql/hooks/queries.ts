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
  GetDatasetQuery,
  GetDatasetsQuery,
  GetFineTunedModelQuery,
  GetFineTunedModelVariantQuery,
  GetFineTunedModelVariantsQuery,
  GetFineTunedModelsQuery,
  GetPromptQuery,
  GetPromptVersionQuery,
  Pagination,
  RequestReport,
} from "../../../@generated/graphql/graphql";
import { GraphQLErrorResponse, ReportRequestResponse } from "../types";
import { Provider } from "@pezzo/types";
import { GET_PROMPT, GET_PROMPT_VERSION } from "../definitions/queries/prompts";
import { useEffect } from "react";
import { useFiltersAndSortParams } from "../../lib/hooks/useFiltersAndSortParams";
import { GET_FINE_TUNED_MODEL, GET_FINE_TUNED_MODELS, GET_FINE_TUNED_MODEL_VARIANT, GET_FINE_TUNED_MODEL_VARIANTS } from "../definitions/queries/fine-tuning";
import { GET_DATASET, GET_DATASETS } from "../definitions/queries/datasets";

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

/* Fine Tuning */
export const useFineTunedModels = (
  options: UseQueryOptions<GetFineTunedModelsQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "fineTunedModels"],
    queryFn: () =>
      gqlClient.request(GET_FINE_TUNED_MODELS, {
        data: { projectId: project?.id },
      }),
    ...options,
  });

  return { ...result, fineTunedModels: result.data?.fineTunedModels };
};

export const useFineTunedModel = (
  modelId: string,
  options: UseQueryOptions<GetFineTunedModelQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "fineTunedModel"],
    queryFn: () =>
      gqlClient.request(GET_FINE_TUNED_MODEL, {
        data: { id: modelId },
      }),
    ...options,
  });

  return { ...result, model: result.data?.fineTunedModel };
};

export const useFineTunedModelVariants = (
  modelId: string,
  options: UseQueryOptions<GetFineTunedModelVariantsQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "fineTunedModelVariants"],
    queryFn: () =>
      gqlClient.request(GET_FINE_TUNED_MODEL_VARIANTS, {
        data: { modelId },
      }),
    ...options,
  });

  return { ...result, variants: result.data?.fineTunedModelVariants };
};

export const useFineTunedModelVariant = (
  id: string,
  options: UseQueryOptions<GetFineTunedModelVariantQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "fineTunedModelVariant"],
    queryFn: () =>
      gqlClient.request(GET_FINE_TUNED_MODEL_VARIANT, {
        data: { id },
      }),
    ...options,
  });

  return { ...result, variant: result.data?.fineTunedModelVariant };
};

export const useDatasets = (
  options: UseQueryOptions<GetDatasetsQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "datasets"],
    queryFn: () =>
      gqlClient.request(GET_DATASETS, {
        data: { projectId: project?.id },
      }),
    ...options,
  });

  return { ...result, datasets: result.data?.datasets };
};

export const useDataset = (
  modelId: string,
  options: UseQueryOptions<GetDatasetQuery, GraphQLErrorResponse> = {}
) => {
  const { project } = useCurrentProject();
  const result = useQuery({
    enabled: !!project,
    queryKey: ["project", project?.id, "dataset"],
    queryFn: () =>
      gqlClient.request(GET_DATASET, {
        data: { id: modelId },
      }),
    ...options,
  });

  return { ...result, dataset: result.data?.dataset };
};