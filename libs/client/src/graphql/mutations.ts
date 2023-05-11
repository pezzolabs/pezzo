import { graphql } from "../@generated/graphql";

export const REPORT_PROMPT_EXECUTION = graphql(/* GraphQL */ `
  mutation reportPromptExecution($data: PromptExecutionCreateInput!) {
    reportPromptExecution(data: $data) {
      id
      promptId
      status
      result
      totalCost
      totalTokens
      duration
    }
  }
`);
