import { graphql } from "@pezzo/graphql";

export const GET_PROJECT = graphql(/* GraphQL */ `
  query getProject($data: ProjectWhereUniqueInput!) {
    project(data: $data) {
      id
      slug
      name
    }
  }
`);

export const GET_ALL_PROJECTS = graphql(/* GraphQL */ `
  query getProjects {
    projects {
      id
      slug
      name
    }
  }
`);

export const CREATE_PROJECT = graphql(/* GraphQL */ `
  mutation createProject($data: CreateProjectInput!) {
    createProject(data: $data) {
      organizationId
      name
    }
  }
`);
