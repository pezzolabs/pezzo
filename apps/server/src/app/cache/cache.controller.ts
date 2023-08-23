import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PinoLogger } from "../logger/pino-logger";
import { CacheService } from "./cache.service";
import { ApiKeyOrgId } from "../identity/api-key-org-id.decoator";
import { ProjectId } from "../identity/project-id.decorator";
import { ApiKeyAuthGuard } from "../auth/api-key-auth.guard";
import { ProjectIdAuthGuard } from "../auth/project-id-auth.guard";
import { CacheRequestDto } from "@pezzo/client";

@Controller("/cache/v1")
export class CacheController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly cacheService: CacheService
  ) {}

  // @UseGuards(ApiKeyAuthGuard)
  // @UseGuards(ProjectIdAuthGuard)
  @Get("/request")
  async fetchCachedRequest(
    @Query("request") requestBase64: string
    // @ApiKeyOrgId() organizationId: string,
    // @ProjectId() projectId: string
  ) {
    this.logger
      .assign({
        // organizationId,
        // projectId,
      })
      .info("fetchCachedRequest");

    const request = JSON.parse(
      Buffer.from(requestBase64, "base64").toString("utf-8")
    );
    const cachedRequest = this.cacheService.fetchRequest(request);

    return {
      hit: !!cachedRequest,
      data: cachedRequest?.data ?? null,
    };
  }

  @Post("/request")
  async cacheRequest(
    @Body("request") request: CacheRequestDto["request"],
    @Body("response") response: CacheRequestDto["response"]
    // @ApiKeyOrgId() organizationId: string,
    // @ProjectId() projectId: string
  ) {
    this.logger
      .assign({
        // organizationId,
        // projectId,
      })
      .info("cacheRequest");

    const hash = this.cacheService.cacheRequest({ request, response });

    return {
      hash,
      exp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}
