import { graphql } from "../../../../@generated/graphql";

export const CREATE_DATASET = graphql(/* GraphQL */ `
  mutation CreateDataset($data: CreateDatasetInput!) {
    createDataset(data: $data) {
      id
      name
    }
  }
`);

export const INSERT_TO_DATASET = graphql(/* GraphQL */ `
  mutation InsertToDataset($data: InsertToDatasetInput!) {
    insertToDataset(data: $data) {
      id
    }
  }
`);