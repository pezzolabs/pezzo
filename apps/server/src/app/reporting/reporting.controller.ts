import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ReportRequestDto } from "./dto/report-request.dto";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { ProjectId } from "../identity/project-id.decorator";
import { PinoLogger } from "../logger/pino-logger";
import { ReportingService } from "./reporting.service";

@Controller("/reporting/v2")
export class ReportingController {
  constructor(private reportingService: ReportingService, private readonly logger: PinoLogger) { }

  @UseGuards(ApiKeyAuthGuard)
  @UseGuards(ProjectIdAuthGuard)
  @Post("/request")
  async reportRequest(
    @Body() dto: ReportRequestDto,
    @ApiKeyOrgId() organizationId: string,
    @ProjectId() projectId: string
  ) {

    this.logger.assign({
      organizationId,
      projectId,
    }).info("Saving report to OpenSearch")

    try {
      const report = await this.reportingService.saveReport(dto, {
        organizationId,
        projectId,
      });

      return report;
    } catch (error) {
      this.logger.error({ error }, "Error saving report to OpenSearch");
    }
  }
}
