import { HttpStatus } from "@nestjs/common";
import { GraphQLFormattedError } from "graphql";

export function formatError(error: GraphQLFormattedError) {
  const isHttpException =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).extensions?.originalError &&
    Object.prototype.hasOwnProperty.call(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).extensions?.originalError,
      "statusCode"
    );

  if (!isHttpException) {
    return error;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exception = (error as any).extensions?.originalError;

  const formattedError: GraphQLFormattedError = {
    message: exception.message,
    locations: error.locations,
    extensions: {
      code: HttpStatus[exception.statusCode] || "UNKNOWN_ERROR",
    },
  };

  return formattedError;
}
