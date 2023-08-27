import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { ProjectId } from "../identity/project-id.decorator";
import { AddToDatasetDto } from "./dto/add-to-dataset.dto";
import { DatasetsService } from "./datasets.service";

@UseGuards(ApiKeyAuthGuard)
@UseGuards(ProjectIdAuthGuard)
@Controller("/datasets/v1")
export class DatasetsController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly datasetsService: DatasetsService
  ) {}

  @Post("/:datasetId/insert")
  async insertToDataset(
    @ApiKeyOrgId() organizationId: string,
    @ProjectId() projectId: string,
    @Param("datasetId") datasetId: string,
    @Body() dto: AddToDatasetDto,
  ) {
    const dataset = await this.datasetsService.getDataset(datasetId);

    if (!dataset) {
      throw new NotFoundException();
    }

    return this.datasetsService.insertToDataset(datasetId, dto.data);
  }
}
