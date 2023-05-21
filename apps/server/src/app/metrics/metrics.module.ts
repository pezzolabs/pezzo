import { Module } from "@nestjs/common";
import { MetricsResolver } from "./metrics.resolver";

@Module({
  providers: [MetricsResolver],
})
export class MetricsModule {}
