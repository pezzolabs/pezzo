import { Module } from "@nestjs/common";
import { IdentityModule } from "../identity/identity.module";
import { PromptsModule } from "../prompts/prompts.module";
import { PrismaService } from "../prisma.service";
import { ProjectMetricsResolver } from "./project-metrics.resolver";
import { ProjectMetricsService } from "./project-metrics.service";
import { ClickhHouseModule } from "../clickhouse/clickhouse.module";

@Module({
  imports: [IdentityModule, PromptsModule, ClickhHouseModule],
  providers: [ProjectMetricsResolver, PrismaService, ProjectMetricsService],
})
export class MetricsModule {}
