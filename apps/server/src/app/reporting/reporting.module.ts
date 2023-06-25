import { Module } from "@nestjs/common";
import { ReportingController } from "./reporting.controller";
import { AuthModule } from "../auth/auth.module";
import { LoggerModule } from "@pezzo/logger";
import { IdentityModule } from "../identity/identity.module";
import { OpenSearchService } from "./opensearch.service";

@Module({
  imports: [LoggerModule, AuthModule, IdentityModule],
  controllers: [ReportingController],
  providers: [OpenSearchService]
})
export class ReportingModule {}