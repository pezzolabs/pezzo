import { graphql } from "~/@generated/graphql";

export const GET_ALL_PROMPTS = graphql(/* GraphQL */ `
  query getAllPrompts($data: GetProjectPromptsInput!) {
    prompts(data: $data) {
      id
      name
      isDraft
    }
  }
`);

export const GET_PROMPT = graphql(/* GraphQL */ `
  query getPrompt($data: GetPromptInput!) {
    prompt(data: $data) {
      id
      name
      isDraft
      latestVersion {
        sha
        message
        createdBy {
          name
          photoUrl
        }
      }
    }
  }
`);

export const GET_PROMPT_VERSION = graphql(/* GraphQL */ `
  query getPromptVersion($data: PromptVersionWhereUniqueInput!) {
    promptVersion(data: $data) {
      sha
      type
      service
      content
      settings
      message
    }
  }
`);

export const GET_PROMPT_VERSIONS = graphql(/* GraphQL */ `
  query GetPromptVersionsWithTags($data: GetPromptInput!) {
    prompt(data: $data) {
      versions {
        type
        sha
        service
        message
        createdAt
        createdBy {
          name
          photoUrl
          email
        }
      }
    }
  }
`);

export const GET_MODELS = graphql(/* GraphQL */ `
  query getModels($data: GetProjectPromptsInput!) {
    models(data: $data) {
      gai_req_id
      models
    }
  }
`);
