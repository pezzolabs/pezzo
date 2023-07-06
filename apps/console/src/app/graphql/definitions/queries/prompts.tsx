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
      latestVersion {
        sha
        content
        settings
      }
      version(data: $data) {
        sha
        content
        settings
      }
    }
  }
`);

export const GET_PROMPT_VERSIONS = graphql(/* GraphQL */ `
  query GetPromptVersionsWithTags($data: GetPromptInput!) {
    prompt(data: $data) {
      versions {
        sha
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

export const GET_PROMPT_VERSION = graphql(/* GraphQL */ `
  query getPromptVersion($data: GetPromptVersionInput!) {
    promptVersion(data: $data) {
      sha
      content
      settings
    }
  }
`);
