
import { graphql } from "../../../../@generated/graphql";

export const GET_DATASETS = graphql(/* GraphQL */ `
  query GetDatasets($data: GetDatasetsInput!) {
    datasets(data: $data) {
      id
      name
      projectId
    }
  }
`);

export const GET_DATASET = graphql(/* GraphQL */ `
  query GetDataset($data: DatasetWhereUniqueInput!) {
    dataset(data: $data) {
      id
      name
      projectId
      data
    }
  }
`);