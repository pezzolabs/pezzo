import { graphql } from "../../../../@generated/graphql";

export const GET_ALL_PROMPTS = graphql(/* GraphQL */ `
  query getAllPrompts($data: GetProjectPromptsInput!) {
    prompts(data: $data) {
      id
      name
    }
  }
`);

export const GET_PROMPT = graphql(/* GraphQL */ `
  query getPrompt($data: GetPromptInput!) {
    prompt(data: $data) {
      id
      name
      type
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
      type
      versions {
        sha
        service
        message
        createdAt
        createdBy {
          name
          photoUrl
        }
      }
    }
  }
`);
