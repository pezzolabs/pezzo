import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { PrismaService } from "../prisma.service";
import { PromptVersion } from "../../@generated/prompt-version/prompt-version.model";
import { CurrentUser } from "../identity/current-user.decorator";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { RequestUser } from "../identity/users.types";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { Prompt } from "../../@generated/prompt/prompt.model";
import {
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { PromptsService } from "./prompts.service";
import { AuthGuard } from "../auth/auth.guard";
import { ExtendedUser } from "../identity/models/extended-user.model";
import { UsersService } from "../identity/users.service";

@UseGuards(AuthGuard)
@Resolver(() => PromptVersion)
export class PromptVersionsResolver {
  constructor(
    private prismaService: PrismaService,
    private logger: PinoLogger,
    private analytics: AnalyticsService,
    private promptsService: PromptsService,
    private usersService: UsersService
  ) {}

  @Mutation(() => PromptVersion)
  async createPromptVersion(
    @Args("data") data: CreatePromptVersionInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ ...data }).info("Creating prompt version");
    let prompt: Prompt;

    try {
      prompt = await this.promptsService.getPrompt(data.promptId);
    } catch (error) {
      this.logger.error({ error }, "Error getting existing prompt");
      throw new InternalServerErrorException();
    }

    if (!prompt) {
      throw new NotFoundException();
    }

    isProjectMemberOrThrow(user, prompt.projectId);

    try {
      const promptVersion = await this.promptsService.createPromptVersion(
        data,
        user.id
      );
      this.analytics.track("PROMPT_VERSION:CREATED", user.id, {
        projectId: prompt.projectId,
        promptId: prompt.id,
      });
      return promptVersion;
    } catch (error) {
      this.logger.error({ error }, "Error creating prompt version");
      throw new InternalServerErrorException();
    }
  }

  @ResolveField(() => ExtendedUser)
  async createdBy(@Parent() parent: PromptVersion) {
    const user = await this.usersService.getById(parent.createdById);
    const extendedUser = this.usersService.serializeExtendedUser(user);
    return extendedUser;
  }
}
