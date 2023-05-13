import { Query, Resolver } from "@nestjs/graphql";
import { ApiKey } from "../../@generated/api-key/api-key.model";
import { APIKeysService } from "./api-keys.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";

@UseGuards(AuthGuard)
@Resolver(() => ApiKey)
export class ApiKeysResolver {
  constructor(private apiKeysService: APIKeysService) {}
  
  @Query(() => ApiKey)
  currentApiKey(@CurrentUser() user: RequestUser) {
    const organizationid = user.orgMemberships[0].organizationId;
    return this.apiKeysService.getApiKeyByOrganizationId(organizationid);
  }
}