import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthMethod as _AuthMethod } from './auth.guard';

export const CurrentAuthMethod = createParamDecorator(
  (_: unknown, context: ExecutionContext): _AuthMethod => {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return ctx.req.authMethod;
  }
);