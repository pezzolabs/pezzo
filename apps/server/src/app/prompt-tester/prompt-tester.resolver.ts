import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { PrismaService } from "../prisma.service";
import { PromptTesterService } from "./prompt-tester.service";
import { TestPromptInput } from "../prompts/inputs/test-prompt.input";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { PinoLogger } from "../logger/pino-logger";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { RequestReport } from "../reporting/object-types/request-report.model";
import { SerializedReport } from "@pezzo/types";
import GraphQLJSON from "graphql-type-json";
import {GetPromptCompletionResult} from "@pezzo/client";

@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class PromptTesterResolver {
  constructor(
    private prisma: PrismaService,
    private promptTesterService: PromptTesterService,
    private logger: PinoLogger
  ) {}

  @Mutation(() => GraphQLJSON)
  async testPrompt(
    @Args("data") data: TestPromptInput,
    @CurrentUser() user: RequestUser
  ): Promise<SerializedReport> {
    this.logger
      .assign({
        projectId: data.projectId,
        settings: data.settings,
        type: data.type,
      })
      .info("Testing prompt");

    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    const result = await this.promptTesterService.runGaiPlatformTest(
      data,
      project.id,
      project.organizationId
    );

    return result;
  }
}
