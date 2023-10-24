import { graphql } from "~/@generated/graphql";

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

export const DELETE_PROMPT = graphql(/* GraphQL */ `
  mutation deletePrompt($data: PromptWhereUniqueInput!) {
    deletePrompt(data: $data) {
      id
    }
  }
`);
