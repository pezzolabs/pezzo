import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { CONTEXT, GqlExecutionContext } from "@nestjs/graphql";
// import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { UsersService } from "../identity/users.service";
import { RequestUser } from "../identity/users.types";
// import Session, { SessionContainer } from "supertokens-node/recipe/session";
import { PinoLogger } from "../logger/pino-logger";
import { updateRequestContext } from "../cls.utils";
import fetch from "cross-fetch";

export enum AuthMethod {
  ApiKey = "ApiKey",
  BearerToken = "BearerToken",
}

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
    @Inject(CONTEXT)
    private readonly context = { eventContext: null }
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const req = context.switchToHttp().getRequest();
    // this.logger.info("req: " + JSON.stringify(req));
    return this.authorizeBearerToken(context);
  }

  private async authorizeBearerToken(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req;
    const res = ctx.res;
    this.logger.info("======req: " + req.user);

    // let session: SessionContainer;

    // try {
    //   session = await Session.getSession(req, res, {
    //     sessionRequired: false,
    //     antiCsrfCheck: process.env.NODE_ENV === "development" ? false : true,
    //   });
    // } catch (error) {
    //   throw new UnauthorizedException();
    // }

    // if (!session) {
    //   throw new UnauthorizedException();
    // }

    // const supertokensUser = await ThirdPartyEmailPassword.getUserById(
    //   session.getUserId()
    // );
    // this.logger.info("req: " + JSON.stringify(req.user));
    // this.logger.info("res: " + JSON.stringify(res));

    // const oktaUrl = "https://llm-ops-portal.dev.smartnews.net/oauth2/userinfo"
    // const response = await fetch(oktaUrl, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await response.json();
    // console.log("user info from Okta: " + JSON.stringify(data));
    // if (!response.ok) {
    //   if (data?.message) {
    //     throw new Error(data.message);
    //   } else {
    //     throw new Error(
    //       `Error fetching user info from Okta.`
    //     );
    //   }
    // }

    const supertokensUser = {
      id: "",
      email: "dp-admin@smartnews.com"
    }

    req["supertokensUser"] = supertokensUser;

    const user = await this.usersService.getUser(supertokensUser.email);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    try {
      const memberships = await this.usersService.getUserOrgMemberships(
        supertokensUser.email
      );

      const reqUser: RequestUser = {
        id: user.id,
        // supertokensUserId: supertokensUser.id,
        supertokensUserId: user.id, // use user.id as supertokensUserId
        email: user.email,
        orgMemberships: memberships.map((m) => ({
          organizationId: m.organizationId,
          memberSince: m.createdAt,
          role: m.role,
        })),
      };
      const eventContext = {
        userId: reqUser.id,
        organizationId: reqUser.orgMemberships[0].organizationId,
      };
      this.context.eventContext = eventContext;
      updateRequestContext(eventContext);

      this.context.eventContext = {
        userId: reqUser.id,
        organizationId: reqUser.orgMemberships[0].organizationId,
      };

      req["user"] = reqUser;
      this.logger.assign({ userId: reqUser.id });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    req.authMethod = AuthMethod.BearerToken;
    return true;
  }
}
