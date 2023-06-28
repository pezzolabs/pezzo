import { Request, InternalServerErrorException, UseGuards, ForbiddenException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { OpenSearchService } from "./opensearch.service";
import { RequestReport } from "./object-types/request-report.model";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { GetRequestsInput } from "./inputs/get-requests.input";
import { ProjectsService } from "../identity/projects.service";



@UseGuards(AuthGuard)
@Resolver(() => RequestReport)
export class RequestReportsResolver {

  constructor(
    private readonly openSearchService: OpenSearchService,
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger,
  ) { }

  @Query(() => [RequestReport])
  async requestReports(
    @Args("data") data: GetRequestsInput,
    @CurrentUser() user: RequestUser,
  ) {


    isOrgMemberOrThrow(user, data.organizationId);

    try {
      const userProjects = await this.projectsService.getProjectsByOrgId(data.organizationId);

      if (!userProjects.find((p) => p.id === data.projectId)) {
        throw new ForbiddenException();
      }

    } catch (error) {
      this.logger.error(error, "Error getting projects");
      throw new InternalServerErrorException();
    }


    try {

      const response = await this.openSearchService.getReports({
        projectId: data.projectId
      });

      return response.body.hits.hits.map((hit) => hit._source);

    } catch (error) {
      this.logger.error(error, "Error getting reports from OpenSearch");
      throw new InternalServerErrorException();
    }
  }

}
