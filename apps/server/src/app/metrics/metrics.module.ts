import { Module } from "@nestjs/common";
import { MetricsResolver } from "./metrics.resolver";
import { IdentityModule } from "../identity/identity.module";
import { PromptsModule } from "../prompts/prompts.module";

@Module({
  imports: [IdentityModule, PromptsModule],
  providers: [MetricsResolver],
})
export class MetricsModule {}
