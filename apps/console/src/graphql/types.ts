import {
  Provider,
} from "@pezzo/types";
import { GraphQLError } from "graphql-request/build/esm/types";

export interface GraphQLErrorResponse {
  response:
    | {
        errors: GraphQLError[];
      }
    | undefined;
}

export type ReportRequestResponse<
  TProviderType extends Provider | unknown = unknown
> = Record<string, any>;