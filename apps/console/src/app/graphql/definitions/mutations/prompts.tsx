import { graphql } from "../../../../@generated/graphql";

export const CREATE_PROMPT = graphql(/* GraphQL */ `
  mutation createPrompt($data: CreatePromptInput!) {
    createPrompt(data: $data) {
      id
    }
  }
`);

export const CREATE_PROMPT_VERSION = graphql(/* GraphQL */ `
  mutation createPromptVersion($data: CreatePromptVersionInput!) {
    createPromptVersion(data: $data) {
      sha
    }
  }
`);

export const TEST_PROMPT = graphql(/* GraphQL */ `
  mutation testPrompt($data: TestPromptInput!) {
    testPrompt(data: $data) {
      id
      timestamp
      status
      settings
      result
      duration
      promptTokens
      completionTokens
      totalTokens
      promptCost
      completionCost
      totalCost
      error
      content
      interpolatedContent
      variables
    }
  }
`);
