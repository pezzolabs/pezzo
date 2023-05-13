import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Error as STError } from "supertokens-node";

import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { VerifySessionOptions } from "supertokens-node/recipe/session";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    const resp = ctx.getResponse();
    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
      err = res;
    });

    if (resp.headersSent) {
      throw new STError({
        message: "RESPONSE_SENT",
        type: "RESPONSE_SENT",
      });
    }

    if (err) {
      throw err;
    }

    return true;
  }
}
