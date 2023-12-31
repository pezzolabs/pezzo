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
import { GetReportInput, GetRequestsInput } from "./inputs/get-requests.input";
import { ProjectsService } from "../identity/projects.service";
import { PaginatedReportsResult } from "./object-types/request-report-result.model";
import GraphQLJSON from "graphql-type-json";
import { SerializedReport } from "@pezzo/types";

@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class RequestReportsResolver {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger
  ) {}

  @Query(() => GraphQLJSON)
  async report(
    @Args("data") data: GetReportInput,
    @CurrentUser() user: RequestUser
  ): Promise<SerializedReport> {
    let project;
    
    try {
      project = await this.projectsService.getProjectById(data.projectId);

      if (!project) {
        throw new NotFoundException();
      }

      isOrgMemberOrThrow(user, project.organizationId);
    } catch (error) {
      this.logger.error(error, "Error getting projects");
      throw new InternalServerErrorException();
    }

    const result = await this.reportingService.getReportById(data.reportId, data.projectId);
    return result;
  }

  @Query(() => PaginatedReportsResult)
  async paginatedRequests(
    @Args("data") data: GetRequestsInput,
    @CurrentUser() user: RequestUser
  ): Promise<PaginatedReportsResult> {
    let project;

    try {
      project = await this.projectsService.getProjectById(data.projectId);

      if (!project) {
        throw new NotFoundException();
      }

      isOrgMemberOrThrow(user, project.organizationId);
    } catch (error) {
      this.logger.error(error, "Error getting projects");
      throw new InternalServerErrorException();
    }

    const result = await this.reportingService.getReports({
      projectId: data.projectId,
      offset: data.offset,
      limit: data.limit,
      filters: data.filters,
      sort: data.sort,
    });

    return result;
  }
}
