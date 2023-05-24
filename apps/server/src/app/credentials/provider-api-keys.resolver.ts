import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProviderApiKey } from "../../@generated/provider-api-key/provider-api-key.model";
import { CreateProviderApiKeyInput } from "./inputs/create-provider-api-key.input";
import { ProviderApiKeysService } from "./provider-api-keys.service";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { GetProviderApiKeysInput } from "./inputs/get-provider-api-keys.input";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";

@UseGuards(AuthGuard)
@Resolver(() => ProviderApiKey)
export class ProviderApiKeysResolver {
  constructor(
    private providerAPIKeysService: ProviderApiKeysService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Query(() => [ProviderApiKey])
  async providerApiKeys(
    @Args("data") data: GetProviderApiKeysInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;
    isProjectMemberOrThrow(user, projectId);
    try {
      this.logger.assign({ projectId }).info("Getting provider API keys");
      const keys = await this.providerAPIKeysService.getAllProviderApiKeys(
        projectId
      );
      return keys.map((key) => ({
        ...key,
        value: this.censorApiKey(key.value),
      }));
    } catch (error) {
      this.logger.error({ error }, "Error getting provider API keys");
    }
  }

  @Mutation(() => ProviderApiKey)
  async updateProviderApiKey(
    @Args("data") data: CreateProviderApiKeyInput,
    @CurrentUser() user: RequestUser
  ) {
    const { provider, projectId, value } = data;
    isProjectMemberOrThrow(user, projectId);

    try {
      this.logger
        .assign({ provider, projectId })
        .info("Updating provider API key");
      const key = await this.providerAPIKeysService.upsertProviderApiKey(
        provider,
        value,
        projectId
      );

      this.analytics.track("PROVIDER_API_KEY:CREATED", user.id, {
        projectId,
        provider,
      });

      return {
        ...key,
        value: this.censorApiKey(key.value),
      };
    } catch (error) {
      this.logger.error({ error }, "Error updating provider API key");
      throw new InternalServerErrorException();
    }
  }

  private censorApiKey(value: string) {
    return value.substring(0, 3) + "..." + value.substring(value.length - 3);
  }
}
