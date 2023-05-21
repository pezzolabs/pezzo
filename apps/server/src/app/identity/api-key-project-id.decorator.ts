import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const ApiKeyProjectId = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return ctx.req.projectId;
  }
);
