import { graphql } from "../../../../@generated/graphql";

export const GET_FINE_TUNED_MODELS = graphql(/* GraphQL */ `
  query GetFineTunedModels($data: GetFineTunedModelsInput!) {
    fineTunedModels(data: $data) {
      id
      name
      projectId
    }
  }
`);

export const GET_FINE_TUNED_MODEL = graphql(/* GraphQL */ `
  query GetFineTunedModel($data: FineTunedModelWhereUniqueInput!) {
    fineTunedModel(data: $data) {
      id
      name
      projectId
    }
  }
`);

export const GET_FINE_TUNED_MODEL_VARIANTS = graphql(/* GraphQL */ `
  query GetFineTunedModelVariants($data: GetFineTunedModelVariantsInput!) {
    fineTunedModelVariants(data: $data) {
      id
      slug
      fineTunedModelId
      status
      enrichment
    }
  }
`);

export const GET_FINE_TUNED_MODEL_VARIANT = graphql(/* GraphQL */ `
  query GetFineTunedModelVariant($data: FineTunedModelVariantWhereUniqueInput!) {
    fineTunedModelVariant(data: $data) {
      id
      slug
      fineTunedModelId
      dataSnapshot
      status
    }
  }
`);