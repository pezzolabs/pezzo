import { graphql } from "../@generated/graphql";

export const GET_DEPLOYED_PROMPT_VERSION = graphql(/* GraphQL */ `
  query findPromptWithDeployedVersion(
    $data: FindPromptByNameInput!
    $deployedVersionData: ResolveDeployedVersionInput!
  ) {
    findPromptWithApiKey(data: $data) {
      id
      name
      deployedVersion(data: $deployedVersionData) {
        sha
        content
        settings
      }
    }
  }
`);
