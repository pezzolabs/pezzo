import { graphql } from "../../../@generated/graphql";

export const GET_ALL_PROMPTS = graphql(/* GraphQL */ `
  query getAllPrompts($data: GetProjectPromptsInput!) {
    prompts(data: $data) {
      id
      name
      integrationId
    }
  }
`);

export const GET_PROMPT = graphql(/* GraphQL */ `
  query getPrompt($data: GetPromptInput!) {
    prompt(data: $data) {
      id
      integrationId
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

export const GET_PROMPT_VERSIONS_LIST = graphql(/* GraphQL */ `
  query promptVersions($data: PromptWhereUniqueInput!) {
    promptVersions(data: $data) {
      sha
      message
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
