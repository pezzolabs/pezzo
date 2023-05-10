import { graphql } from "@pezzo/graphql";

export const GET_PROMPT_EXECUTIONS = graphql(/* GraphQL */ `
  query getPromptExecutions($data: PromptExecutionWhereInput!) {
    promptExecutions(data: $data) {
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
      promptVersionSha
    }
  }
`);

export const GET_PROMPT_EXECUTION = graphql(/* GraphQL */ `
  query getPromptExecution($data: PromptExecutionWhereUniqueInput!) {
    promptExecution(data: $data) {
      id
      timestamp
      status
      promptCost
      completionCost
      totalCost
      promptTokens
      completionTokens
      totalTokens
      duration
      settings
      variables
      interpolatedContent
      error
      result
      content
    }
  }
`);
