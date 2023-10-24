import { graphql } from "~/@generated/graphql";

export const CREATE_PROJECT = graphql(/* GraphQL */ `
  mutation createProject($data: CreateProjectInput!) {
    createProject(data: $data) {
      id
      organizationId
      name
    }
  }
`);

export const DELETE_PROJECT = graphql(/* GraphQL */ `
  mutation deleteProject($data: ProjectWhereUniqueInput!) {
    deleteProject(data: $data) {
      id
    }
  }
`);

export const UPDATE_PROJECT_SETTINGS = graphql(/* GraphQL */ `
  mutation updateProjectSettings($data: UpdateProjectSettingsInput!) {
    updateProjectSettings(data: $data) {
      id
    }
  }
`);
