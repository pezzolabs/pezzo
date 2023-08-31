import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import {
  UseGuards,
} from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { PrismaService } from "../prisma.service";
import { ProjectMetric } from "./models/project-metric.model";
import {
  GetProjectMetricInput,
  ProjectMetricType,
} from "./inputs/get-project-metrics.input";
import { ProjectMetricsService } from "./project-metrics.service";

@UseGuards(AuthGuard)
@Resolver(() => ProjectMetric)
export class ProjectMetricsResolver {
  constructor(
    private prismaService: PrismaService,
    private projectMetricsService: ProjectMetricsService,
    private readonly logger: PinoLogger,
  ) {}

  @Query(() => ProjectMetric)
  async projectMetric(
    @Args("data") data: GetProjectMetricInput,
    @CurrentUser() user: RequestUser
  ): Promise<ProjectMetric> {
    this.logger.assign({ data });
    this.logger.info("Getting project metric");

    const { projectId, metric, timeframe } = data;

    const project = await this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    switch(metric) {
      case ProjectMetricType.requests:
        return this.projectMetricsService.getRequests(projectId, timeframe);
      case ProjectMetricType.cost:
        return this.projectMetricsService.getCost(projectId, timeframe);
      case ProjectMetricType.duration:
        return this.projectMetricsService.getAvgDuration(projectId, timeframe);
      case ProjectMetricType.erroneousRequests:
        return this.projectMetricsService.getErroneousRequests(projectId, timeframe);
    }
  }
}
