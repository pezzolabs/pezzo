import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from "@nestjs/graphql";
import { RequestUser } from './users.types';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): RequestUser => {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return ctx.req.user;
  }
);