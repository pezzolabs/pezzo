import { Args, Query, Resolver } from "@nestjs/graphql";
import { ApiKey } from "../../@generated/api-key/api-key.model";
import { APIKeysService } from "./api-keys.service";
import { InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { GetApiKeyInput } from "./inputs/get-api-key.input";
import { isProjectMemberOrThrow } from "./identity.utils";
import { OrganizationMember } from "../../@generated/organization-member/organization-member.model";
import { PinoLogger } from "../logger/pino-logger";

@UseGuards(AuthGuard)
@Resolver(() => ApiKey)
export class ApiKeysResolver {
  constructor(private apiKeysService: APIKeysService, private logger: PinoLogger) {}

  @Query(() => ApiKey)
  currentApiKey(
    @Args("data") data: GetApiKeyInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;
    isProjectMemberOrThrow(user, projectId);
    this.logger.assign({ projectId }).info("Getting current API key");

    try {
      return this.apiKeysService.getApiKeyByProjectId(projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting current API key");
      throw new InternalServerErrorException();      
    }
  }
}
