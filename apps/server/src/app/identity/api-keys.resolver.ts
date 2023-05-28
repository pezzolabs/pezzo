import { Args, Query, Resolver } from "@nestjs/graphql";
import { ApiKey } from "../../@generated/api-key/api-key.model";
import { ApiKeysService } from "./api-keys.service";
import { InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { GetApiKeyInput } from "./inputs/get-api-key.input";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { PinoLogger } from "../logger/pino-logger";
import { EnvironmentsService } from "./environments.service";

@UseGuards(AuthGuard)
@Resolver(() => ApiKey)
export class ApiKeysResolver {
  constructor(
    private apiKeysService: ApiKeysService,
    private logger: PinoLogger,
    private environmentService: EnvironmentsService
  ) {}

  @Query(() => ApiKey)
  currentApiKey(
    @Args("data") data: GetApiKeyInput,
    @CurrentUser() user: RequestUser
  ) {
    const { environmentId } = data;
    isProjectMemberOrThrow(user, environmentId);
    this.logger.assign({ environmentId }).info("Getting current API key");

    try {
      return this.apiKeysService.getApiKeyByEnvironmentId(environmentId);
    } catch (error) {
      this.logger.error({ error }, "Error getting current API key");
      throw new InternalServerErrorException();
    }
  }
}
