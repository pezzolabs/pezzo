import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiKeysService } from "../identity/api-keys.service";
import { PinoLogger } from "@pezzo/logger";

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

    if (!req.headers["x-pezzo-api-key"]) {
      throw new UnauthorizedException("Invalid Pezzo API Key");
    }

    return this.authorizeApiKey(req);
  }

  private async authorizeApiKey(req) {
    this.logger.assign({ method: AuthMethod.ApiKey });
    const keyValue = req.headers["x-pezzo-api-key"];
    const apiKey = await this.apiKeysService.getApiKey(keyValue);

    if (!apiKey) {
      throw new UnauthorizedException("Invalid Pezzo API Key");
    }

    const organization = apiKey.organization;

    req.organizationId = organization.id;
    req.authMethod = AuthMethod.ApiKey;
    this.logger.assign({
      organizationId: organization.id,
    });

    return true;
  }
}
