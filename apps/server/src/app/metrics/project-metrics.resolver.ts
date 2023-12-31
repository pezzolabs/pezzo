import { Args, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { isOrgMemberOrThrow } from "../identity/identity.utils";
import { PrismaService } from "../prisma.service";
import {
  GenericProjectHistogramResult,
  ProjectMetric,
  ProjectMetricDeltaResult,
} from "./models/project-metric.model";
import {
  GetProjectGenericHistogramInput,
  GetProjectMetricDeltaInput,
} from "./inputs/get-project-metrics.input";
import { ProjectMetricsService } from "./project-metrics.service";

@UseGuards(AuthGuard)
@Resolver(() => ProjectMetric)
export class ProjectMetricsResolver {
  constructor(
    private prismaService: PrismaService,
    private projectMetricsService: ProjectMetricsService,
    private readonly logger: PinoLogger
  ) {}

  @Query(() => GenericProjectHistogramResult)
  async genericProjectMetricHistogram(
    @Args("data") data: GetProjectGenericHistogramInput,
    @CurrentUser() user: RequestUser
  ): Promise<GenericProjectHistogramResult> {
    this.logger.assign({ data });
    this.logger.info("Getting project metric histogram");

    const { projectId, histogramId, startDate, endDate, bucketSize, filters } = data;

    const project = await this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);
    return this.projectMetricsService.getGenericHistogram(
      projectId,
      histogramId,
      startDate,
      endDate,
      bucketSize,
      filters
    );
  }

  @Query(() => ProjectMetricDeltaResult)
  async projectMetricDelta(
    @Args("data") data: GetProjectMetricDeltaInput,
    @CurrentUser() user: RequestUser
  ): Promise<ProjectMetricDeltaResult> {
    this.logger.assign({ data });
    this.logger.info("Getting project metric with deltas");

    const { projectId, startDate, endDate, metric } = data;

    const project = await this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    const result = await this.projectMetricsService.getProjectMetricDelta(
      projectId,
      startDate,
      endDate,
      metric,
    );

    return result;
  }
}
