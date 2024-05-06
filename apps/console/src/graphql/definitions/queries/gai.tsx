import { graphql } from "~/@generated/graphql";

export const GET_MODELS = graphql(/* GraphQL */ `
  query getModels {
    models {
      models
      gai_req_id
    }
  }
`);
