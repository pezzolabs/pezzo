import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { GqlExecutionContext } from "@nestjs/graphql";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { UsersService } from "../identity/users.service";
import { RequestUser } from "../identity/users.types";
import { APIKeysService } from "../identity/api-keys.service";
import { User } from "supertokens-node/recipe/thirdpartyemailpassword";
import Session, { SessionContainer } from "supertokens-node/recipe/session";

export enum AuthMethod {
  ApiKey = "ApiKey",
  BearerToken = "BearerToken",
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiKeysService: APIKeysService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);

    const ctx = gqlCtx.getContext();
    const req = ctx.req;
    const res = ctx.res;

    if (req.headers["x-api-key"]) {
      return this.authorizeApiKey(req, res);
    }

    return this.authorizeBearerToken(context);
  }

  private async authorizeApiKey(req, _res) {
    const keyValue = req.headers["x-api-key"];
    const apiKey = await this.apiKeysService.getApiKey(keyValue);

    if (!apiKey) {
      throw new UnauthorizedException();
    }

    req.organizationId = apiKey.organizationId;
    req.authMethod = AuthMethod.ApiKey;

    return true;
  }

  private async authorizeBearerToken(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req;
    const res = ctx.res;

    let session: SessionContainer;

    try {
      session = await Session.getSession(req, res, {
        sessionRequired: false,
      });

      console.log('session', session);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!session) {
      throw new UnauthorizedException();
    }

    const supertokensUser = await ThirdPartyEmailPassword.getUserById(
      session.getUserId()
    );
    req["supertokensUser"] = supertokensUser;

    try {
      const user = await this.usersService.getOrCreateUser(supertokensUser);
      const memberships = await this.usersService.getUserOrgMemberships(
        user.id
      );

      const reqUser: RequestUser = {
        id: user.id,
        email: user.email,
        orgMemberships: memberships.map((m) => ({
          organizationId: m.organizationId,
          memberSince: m.createdAt,
          role: m.role,
        })),
      };

      req["user"] = reqUser;
    } catch (error) {
      console.error("Could not fetch or create user", error);
      throw new InternalServerErrorException();
    }

    req.authMethod = AuthMethod.BearerToken;
    return true;
  }
}
