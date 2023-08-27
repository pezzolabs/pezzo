import {
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CacheService } from "./cache.service";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { CacheRequestDto } from "./dto/cache-request.dto";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { ProjectId } from "../identity/project-id.decorator";
import { CacheRequestResult, FetchCachedRequestResult } from "@pezzo/client";
import { RetrieveCacheRequestDto } from "./dto/retrieve-cache-request.dto";

@UseGuards(ApiKeyAuthGuard)
@UseGuards(ProjectIdAuthGuard)
@Controller("/cache/v1")
export class CacheController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly cacheService: CacheService
  ) {}

  @Post("/request/retrieve")
  async retrieveCachedRequest(
    @ApiKeyOrgId() organizationId: string,
    @ProjectId() projectId: string,
    @Body() dto: RetrieveCacheRequestDto
  ): Promise<FetchCachedRequestResult> {
    this.logger
      .assign({
        organizationId,
        projectId,
      })
      .info("fetchCachedRequest");

    const cachedRequest = await this.cacheService.fetchRequest(dto.request);

    const hit = !!cachedRequest;

    if (hit && cachedRequest.metadata.organizationId !== organizationId) {
      return {
        hit: false,
        data: null,
      }
    }

    return {
      hit,
      data: cachedRequest?.response ?? null,
    };
  }

  @Post("/request/save")
  async saveRequestToCache(
    @ApiKeyOrgId() organizationId: string,
    @ProjectId() projectId: string,
    @Body() dto: CacheRequestDto
  ): Promise<CacheRequestResult> {
    this.logger
      .assign({
        organizationId,
        projectId,
      })
      .info("cacheRequest");

    const { hash, exp } = await this.cacheService.cacheRequest({
      request: dto.request,
      response: dto.response,
      organizationId,
      projectId,
    });

    return {
      hash,
      exp,
    };
  }
}
