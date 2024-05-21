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
    return this.authorizeBearerToken(context);
  }

  private async authorizeBearerToken(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req;
    const res = ctx.res;
    // this.logger.info("======req user: " + req.headers["email"]);
    this.logger.info("======req: " + JSON.stringify(req.headers));

    let reqUser: RequestUser;


    // build supertokensUser object by call okta userinfo endpoint in UI
    const supertokensUser = {
      id: "",
      email: req.headers["email"],
    }
    this.logger.info("======req email: " + req.headers["email"]);

    req["supertokensUser"] = supertokensUser;

    if (!supertokensUser.email) {
      // throw new UnauthorizedException("User email is null");
      reqUser = {
        id: null,
        supertokensUserId: null,
        email: null,
        orgMemberships: [],
      };
    }

    const user = await this.usersService.getUser(supertokensUser.email);

    if (!user) {
      // throw new UnauthorizedException("User not found");
      reqUser = {
        id: null,
        supertokensUserId: null,
        email: supertokensUser.email,
        orgMemberships: [],
      };
    }

    try {
      const memberships = await this.usersService.getUserOrgMemberships(
        supertokensUser.email
      );

      reqUser = {
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
