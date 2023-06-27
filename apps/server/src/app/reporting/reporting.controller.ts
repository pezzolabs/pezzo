import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ReportRequestDto } from "./dto/report-request.dto";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { OpenSearchService } from "./opensearch.service";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { ProjectId } from "../identity/project-id.decorator";

@Controller("/reporting/v2")
export class ReportingController {
  constructor(private openSearchService: OpenSearchService) {}

  @UseGuards(ApiKeyAuthGuard)
  @UseGuards(ProjectIdAuthGuard)
  @Post("/request")
  async reportRequest(
    @Body() dto: ReportRequestDto,
    @ApiKeyOrgId() organizationId: string,
    @ProjectId() projectId: string
  ) {
    console.log("Report from org id ", organizationId);
    console.log("Report from project id ", projectId);
    const report = await this.openSearchService.saveReport(dto, {
      organizationId,
      projectId,
    });
    return report;
  }
}
