import { graphql } from "~/@generated/graphql";

export const TEST_PROMPT = graphql(/* GraphQL */ `
  mutation testPrompt($data: TestPromptInput!) {
    testPrompt(data: $data)
  }
`);
