import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { UsersService } from "../identity/users.service";
import { RequestUser } from "../identity/users.types";
import { ApiKeysService } from "../identity/api-keys.service";
import Session, { SessionContainer } from "supertokens-node/recipe/session";
import { ProjectsService } from "../identity/projects.service";
import { PinoLogger } from "../logger/pino-logger";

export enum AuthMethod {
  ApiKey = "ApiKey",
  BearerToken = "BearerToken",
}

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiKeysService: ApiKeysService,
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger
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
    this.logger.assign({ method: AuthMethod.ApiKey });
    const keyValue = req.headers["x-api-key"];
    const apiKey = await this.apiKeysService.getApiKey(keyValue);

    if (!apiKey) {
      throw new UnauthorizedException("Invalid Pezzo API Key");
    }

    const environment = apiKey.environment;

    req.projectId = environment.projectId;
    req.environmentId = environment.id;
    req.authMethod = AuthMethod.ApiKey;
    this.logger.assign({
      environmentId: environment.id,
      projectId: environment.projectId,
    });

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
        antiCsrfCheck: process.env.NODE_ENV === "development" ? false : true,
      });
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
      const projects = await this.projectsService.getProjectsByUser(
        supertokensUser.email
      );
      const memberships = await this.usersService.getUserOrgMemberships(
        supertokensUser.email
      );

      const reqUser: RequestUser = {
        id: supertokensUser.id,
        email: supertokensUser.email,
        projects: projects.map((p) => ({ id: p.id })),
        orgMemberships: memberships.map((m) => ({
          organizationId: m.organizationId,
          memberSince: m.createdAt,
          role: m.role,
        })),
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
