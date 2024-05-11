import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { ProjectId } from "../identity/project-id.decorator";
import { PinoLogger } from "../logger/pino-logger";
import { ReportingService } from "./reporting.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Reporting")
@Controller("/reporting/v2")
export class ReportingController {
  constructor(
    private reportingService: ReportingService,
    private readonly logger: PinoLogger
  ) {}

  // @UseGuards(ApiKeyAuthGuard)
  // @UseGuards(ProjectIdAuthGuard)
  // @Post("/request")
  // @ApiOperation({ summary: "Report a request" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Report has been reported successfully",
  // })
  // @ApiResponse({ status: 500, description: "Internal server error" })
  // async reportRequest(
  //   @Body() dto: CreateReportDto,
  //   @ApiKeyOrgId() organizationId: string,
  //   @ProjectId() projectId: string
  // ) {
  //   this.logger
  //     .assign({
  //       organizationId,
  //       projectId,
  //     })
  //     .info("Saving report");
  //
  //   try {
  //     return this.reportingService.saveReport(dto, {
  //       organizationId,
  //       projectId,
  //     });
  //   } catch (error) {
  //     this.logger.error(error, "Error saving report");
  //     throw new InternalServerErrorException();
  //   }
  // }
}
