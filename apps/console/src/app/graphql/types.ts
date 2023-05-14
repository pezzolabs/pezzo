import { GraphQLError } from "graphql-request/build/esm/types";

export interface GraphQLErrorResponse {
  response:
    | {
        errors: GraphQLError[];
      }
    | undefined;
}
