import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProviderAPIKey } from "../../@generated/provider-api-key/provider-api-key.model";
import { CreateProviderAPIKeyInput } from "./inputs/create-provider-api-key.input";
import { ProviderAPIKeysService } from "./provider-api-keys.service";
import { ProviderAPIKeyWhereUniqueInput } from "../../@generated/provider-api-key/provider-api-key-where-unique.input";

@Resolver(() => ProviderAPIKey)
export class ProviderAPIKeysResolver {
  constructor(private providerAPIKeysService: ProviderAPIKeysService) {}

  @Query(() => [ProviderAPIKey])
  async providerAPIKeys() {
    const keys = await this.providerAPIKeysService.getAllProviderAPIKeys();
    return keys.map((key) => ({ ...key, value: this.censorAPIKey(key.value) }));
  }

  @Mutation(() => ProviderAPIKey)
  async updateProviderAPIKey(@Args("data") data: CreateProviderAPIKeyInput) {
    const key = await this.providerAPIKeysService.upsertProviderAPIKey(
      data.provider,
      data.value
    );

    return {
      ...key,
      value: this.censorAPIKey(key.value),
    };
  }

  private censorAPIKey(value: string) {
    return value.substring(0, 3) + "..." + value.substring(value.length - 3);
  }

  @Mutation(() => Boolean)
  async deleteProviderAPIKey(
    @Args("data") data: ProviderAPIKeyWhereUniqueInput
  ) {
    return this.providerAPIKeysService.deleteProviderAPIKey(data.id);
  }
}
