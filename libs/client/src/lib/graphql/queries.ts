import { graphql } from "@pezzo/graphql";

export const GET_PROMPT_VERSION = graphql(/* GraphQL */ `
  query getPromptVersion($data: GetPromptVersionInput!) {
    promptVersion(data: $data) {
      sha
      content
      settings
      mode
    }
  }
`);

export const FIND_PROMPT = graphql(/* GraphQL */ `
  query findPrompt($data: PromptWhereInput!) {
    findPrompt(data: $data) {
      id
      name
    }
  }
`);

export const GET_DEPLOYED_PROMPT_VERSION = graphql(/* GraphQL */ `
  query deployedPromptVersion($data: GetDeployedPromptVersionInput!) {
    deployedPromptVersion(data: $data) {
      sha
      content
      settings
      mode
    }
  }
`);
