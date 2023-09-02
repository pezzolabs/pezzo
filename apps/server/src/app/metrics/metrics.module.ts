import { Module } from "@nestjs/common";
import { MetricsResolver } from "./metrics.resolver";
import { IdentityModule } from "../identity/identity.module";
import { PromptsModule } from "../prompts/prompts.module";
import { PrismaService } from "../prisma.service";
import { OpenSearchModule } from "../opensearch/opensearch.module";
import { ProjectMetricsResolver } from "./project-metrics.resolver";
import { ProjectMetricsService } from "./project-metrics.service";

@Module({
  imports: [IdentityModule, PromptsModule, OpenSearchModule],
  providers: [
    MetricsResolver,
    ProjectMetricsResolver,
    PrismaService,
    ProjectMetricsService,
  ],
})
export class MetricsModule {}
