import { Module } from "@nestjs/common";
import { ReportingController } from "./reporting.controller";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "../logger/logger.module";
import { IdentityModule } from "../identity/identity.module";
import { ReportingService } from "./reporting.service";
import { RequestReportsResolver } from "./requests.resolver";
import { ClickhHouseModule } from "../clickhouse/clickhouse.module";

@Module({
  imports: [ClickhHouseModule, LoggerModule, IdentityModule],
  exports: [ReportingService],
  controllers: [ReportingController],
  providers: [ReportingService, RequestReportsResolver],
})
export class ReportingModule {}
