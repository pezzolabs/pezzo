import {
  InternalServerErrorException,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { ReportingService } from "./reporting.service";
import { RequestReport } from "./object-types/request-report.model";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { GetRequestsInput } from "./inputs/get-requests.input";
import { ProjectsService } from "../identity/projects.service";
import { RequestReportResult } from "./object-types/request-report-result.model";

@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class RequestReportsResolver {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger
  ) {}

  @Query(() => RequestReportResult)
  async paginatedRequests(
    @Args("data") data: GetRequestsInput,
    @CurrentUser() user: RequestUser
  ): Promise<RequestReportResult> {
    try {
      const project = await this.projectsService.getProjectById(data.projectId);

      if (!project) {
        throw new NotFoundException();
      }

      isOrgMemberOrThrow(user, project.organizationId);
    } catch (error) {
      this.logger.error(error, "Error getting projects");
      throw new InternalServerErrorException();
    }

    try {
      const response = await this.reportingService.getReports({
        projectId: data.projectId,
        page: data.page,
        size: data.size,
      });

      return {
        data: response.body.hits.hits.map((hit) => hit._source),
        pagination: {
          page: data.page,
          size: data.size,
          total: response.body.hits.total.value,
        },
      };
    } catch (error) {
      this.logger.error(error, "Error getting reports from OpenSearch");
      throw new InternalServerErrorException();
    }
  }
}
