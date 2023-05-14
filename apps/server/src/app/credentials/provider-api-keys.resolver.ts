import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProviderApiKey } from "../../@generated/provider-api-key/provider-api-key.model";
import { CreateProviderApiKeyInput } from "./inputs/create-provider-api-key.input";
import { ProviderApiKeysService } from "./provider-api-keys.service";
import { ProviderApiKeyWhereUniqueInput } from "../../@generated/provider-api-key/provider-api-key-where-unique.input";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Resolver(() => ProviderApiKey)
export class ProviderApiKeysResolver {
  constructor(private providerAPIKeysService: ProviderApiKeysService) {}

  @Query(() => [ProviderApiKey])
  async providerApiKeys(@CurrentUser() user: RequestUser) {
    const keys = await this.providerAPIKeysService.getAllProviderApiKeys(
      user.orgMemberships[0].organizationId
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
      user.orgMemberships[0].organizationId
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
