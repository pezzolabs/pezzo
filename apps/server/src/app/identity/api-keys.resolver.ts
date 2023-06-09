import { Args, Query, Resolver } from "@nestjs/graphql";
import { ApiKey } from "../../@generated/api-key/api-key.model";
import { ApiKeysService } from "./api-keys.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { PinoLogger } from "../logger/pino-logger";
import { GetApiKeysInput } from "./inputs/get-api-keys.input";
import { isOrgMemberOrThrow } from "./identity.utils";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";

@UseGuards(AuthGuard)
@Resolver(() => ApiKey)
export class ApiKeysResolver {
  constructor(
    private apiKeysService: ApiKeysService,
    private logger: PinoLogger
  ) {}

  @Query(() => [ApiKey])
  async apiKeys(
    @Args("data") data: GetApiKeysInput,
    @CurrentUser() user: RequestUser
  ) {
    const { organizationId } = data;
    isOrgMemberOrThrow(user, organizationId);

    const apiKeys = await this.apiKeysService.getApiKeysByOrganizationId(
      organizationId
    );
    return apiKeys;
  }
}
