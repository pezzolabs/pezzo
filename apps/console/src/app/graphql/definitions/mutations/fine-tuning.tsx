import { graphql } from "../../../../@generated/graphql";

export const CREATE_FINE_TUNED_MODEL = graphql(/* GraphQL */ `
  mutation CreateFineTunedModel($data: CreateFineTunedModelInput!) {
    createFineTunedModel(data: $data) {
      id
      name
    }
  }
`);

export const CREATE_FINE_TUNED_MODEL_VARIANT = graphql(/* GraphQL */ `
  mutation CreateFineTunedModelVariant($data: CreateFineTunedModelVariantInput!) {
    createFineTunedModelVariant(data: $data) {
      id
      slug
    }
  }
`);