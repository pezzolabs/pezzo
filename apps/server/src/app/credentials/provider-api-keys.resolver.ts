import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProviderApiKey } from "../../@generated/provider-api-key/provider-api-key.model";
import { CreateProviderApiKeyInput } from "./inputs/create-provider-api-key.input";
import { ProviderApiKeysService } from "./provider-api-keys.service";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { GetProviderApiKeysInput } from "./inputs/get-provider-api-keys.input";
import { isProjectMemberOrThrow } from "../identity/identity.utils";

@UseGuards(AuthGuard)
@Resolver(() => ProviderApiKey)
export class ProviderApiKeysResolver {
  constructor(private providerAPIKeysService: ProviderApiKeysService) {}

  @Query(() => [ProviderApiKey])
  async providerApiKeys(
    @Args("data") data: GetProviderApiKeysInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);
    const keys = await this.providerAPIKeysService.getAllProviderApiKeys(
      data.projectId
    );
    return keys.map((key) => ({ ...key, value: this.censorApiKey(key.value) }));
  }

  @Mutation(() => ProviderApiKey)
  async updateProviderApiKey(
    @Args("data") data: CreateProviderApiKeyInput,
    @CurrentUser() user: RequestUser
  ) {
    const key = await this.providerAPIKeysService.upsertProviderApiKey(
      data.provider,
      data.value,
      data.projectId,
    );

    return {
      ...key,
      value: this.censorApiKey(key.value),
    };
  }

  private censorApiKey(value: string) {
    return value.substring(0, 3) + "..." + value.substring(value.length - 3);
  }
}
