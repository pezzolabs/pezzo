import { graphql } from "@pezzo/graphql";

export const GET_ALL_PROMPTS = graphql(/* GraphQL */ `
  query getAllPrompts {
    prompts {
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
        mode
      }
      version(data: $data) {
        sha
        content
        settings
        mode        
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
      sha,
      content,
      settings,
      mode
    }
  }
`);