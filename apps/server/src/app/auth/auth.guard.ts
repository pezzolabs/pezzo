import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { VerifySessionOptions } from "supertokens-node/recipe/session";
import { GqlExecutionContext } from "@nestjs/graphql";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req
    const res = ctx.res;

    let err = undefined;

    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession(this.verifyOptions)(req, res, (res) => {
      err = res;
    });

    const userInfo = await ThirdPartyEmailPassword.getUserById(req.session.getUserId());
    res.userInfo = userInfo;


    if (err) {
      console.log('err', err);
      throw new UnauthorizedException();
    }

    return true;
  }
}
