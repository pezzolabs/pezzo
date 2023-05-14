import { graphql } from "../@generated/graphql";

export const GET_PROMPT_VERSION = graphql(/* GraphQL */ `
  query getPromptVersion($data: GetPromptVersionInput!) {
    promptVersion(data: $data) {
      sha
      content
      settings
    }
  }
`);

export const FIND_PROMPT = graphql(/* GraphQL */ `
  query findPrompt($data: FindPromptByNameInput!) {
    findPromptWithApiKey(data: $data) {
      id
      name
    }
  }
`);

export const GET_DEPLOYED_PROMPT_VERSION = graphql(/* GraphQL */ `
  query deployedPromptVersion($data: GetDeployedPromptVersionInput!) {
    deployedPromptVersionWithApiKey(data: $data) {
      sha
      content
      settings
    }
  }
`);
