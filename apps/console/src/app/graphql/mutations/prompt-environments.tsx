import { graphql } from "@pezzo/graphql";

export const PUBLISH_PROMPT = graphql(/* GraphQL */ `
  mutation PublishPrompt($data: PublishPromptInput!) {
    publishPrompt(data: $data) {
      promptId
      environmentSlug
    }
  }
`);
