import { Module } from "@nestjs/common";
import { ReportingController } from "./reporting.controller";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "../logger/logger.module";
import { IdentityModule } from "../identity/identity.module";
import { ReportingService } from "./reporting.service";
import { OpenSearchModule } from "../opensearch/opensearch.module";
import { RequestReportsResolver } from "./requests.resolver";

@Module({
  imports: [OpenSearchModule, LoggerModule, AuthModule, IdentityModule],
  exports: [ReportingService],
  controllers: [ReportingController],
  providers: [ReportingService, RequestReportsResolver],
})
export class ReportingModule {}
