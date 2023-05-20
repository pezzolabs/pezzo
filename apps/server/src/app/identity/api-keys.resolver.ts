import { Args, Query, Resolver } from "@nestjs/graphql";
import { ApiKey } from "../../@generated/api-key/api-key.model";
import { APIKeysService } from "./api-keys.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { GetApiKeyInput } from "./inputs/get-api-key.input";
import { isProjectMemberOrThrow } from "./identity.utils";
import { OrganizationMember } from "../../@generated/organization-member/organization-member.model";

@UseGuards(AuthGuard)
@Resolver(() => ApiKey)
export class ApiKeysResolver {
  constructor(private apiKeysService: APIKeysService) {}

  @Query(() => ApiKey)
  currentApiKey(
    @Args("data") data: GetApiKeyInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);
    return this.apiKeysService.getApiKeyByProjectId(data.projectId);
  }

  @Query(() => OrganizationMember)
  currentOrganizationMember(@CurrentUser() user: RequestUser) {
    return user.orgMemberships[0];
  }
}
