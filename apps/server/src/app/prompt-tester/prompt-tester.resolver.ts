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

@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class PromptTesterResolver {
  constructor(
    private prisma: PrismaService,
    private promptTesterService: PromptTesterService,
    private logger: PinoLogger
  ) {}

  @Mutation(() => RequestReport)
  async testPrompt(
    @Args("data") data: TestPromptInput,
    @CurrentUser() user: RequestUser
  ): Promise<RequestReport> {
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

    const result = await this.promptTesterService.runTest(
      data,
      project.id,
      project.organizationId
    );

    return result;
  }
}
