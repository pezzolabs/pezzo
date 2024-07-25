import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiKeysService } from "../identity/api-keys.service";
import { PinoLogger } from "../logger/pino-logger";
import { updateRequestContext } from "../cls.utils";

export enum AuthMethod {
  ApiKey = "ApiKey",
  BearerToken = "BearerToken",
}

@Injectable({ scope: Scope.REQUEST })
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly logger: PinoLogger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers["llm-ops-api-key"]) {
      throw new UnauthorizedException("LLM Ops API Key Not Provided");
    }

    return this.authorizeApiKey(req);
  }

  private async authorizeApiKey(req) {
    this.logger.assign({ method: AuthMethod.ApiKey });
    const keyValue = req.headers["llm-ops-api-key"];
    const apiKey = await this.apiKeysService.getApiKey(keyValue);

    if (!apiKey) {
      throw new UnauthorizedException("Invalid LLM Ops API Key");
    }

    const organization = apiKey.organization;

    // Give super admin access to api keys from gai-admin
    if (organization.name === "gai-admin") {
      return true
    }

    req.organizationId = organization.id;
    req.authMethod = AuthMethod.ApiKey;
    this.logger.assign({
      organizationId: organization.id,
    });
    updateRequestContext({ organizationId: organization.id });

    return true;
  }
}
