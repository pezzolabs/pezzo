import { graphql } from "../../../../@generated/graphql";

export const GET_PROJECT = graphql(/* GraphQL */ `
  query getProject($data: ProjectWhereUniqueInput!) {
    project(data: $data) {
      id
      slug
      name
      organization {
        id
        name
      }
    }
  }
`);

export const GET_ALL_PROJECTS = graphql(/* GraphQL */ `
  query getProjects($data: GetProjectsInput!) {
    projects(data: $data) {
      id
      slug
      name
      organizationId
    }
  }
`);
