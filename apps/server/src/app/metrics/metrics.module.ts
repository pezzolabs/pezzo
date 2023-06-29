import { Module } from "@nestjs/common";
import { MetricsResolver } from "./metrics.resolver";
import { IdentityModule } from "../identity/identity.module";
import { PromptsModule } from "../prompts/prompts.module";
import { PrismaService } from "../prisma.service";
import { OpenSearchModule } from "../opensearch/opensearch.module";

@Module({
  imports: [IdentityModule, PromptsModule, OpenSearchModule],
  providers: [MetricsResolver, PrismaService],
})
export class MetricsModule {}
