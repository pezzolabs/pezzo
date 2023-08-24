import { Injectable } from "@nestjs/common";
import {
  CacheRequestDto,
  CacheRequestResult,
  CachedRequest,
} from "@pezzo/client";
import { createHash } from "crypto";
import stableStringify from "json-stable-stringify";
import { RedisService } from "../redis/redis.service";

// 3 days
const REQUEST_CACHE_TTL = 60 * 60 * 24 * 3;

@Injectable()
export class CacheService {
  constructor(private redisService: RedisService) {}

  private generateHash(request: Record<string, any>): string {
    const stringified = stableStringify(request);
    const hash = createHash("sha256").update(stringified).digest("hex");
    return hash;
  }

  async fetchRequest(
    request: Record<string, any>
  ): Promise<CachedRequest | null> {
    const hash = this.generateHash(request);
    const result = await this.redisService.client.json.get(`request:${hash}`, {
      path: ".",
    });

    if (!result) {
      return null;
    }

    this.redisService.client
      .multi()
      .expire(`request:${hash}`, REQUEST_CACHE_TTL)
      .expire(`meta:request:${hash}`, REQUEST_CACHE_TTL)
      .exec();

    const metadata = await this.redisService.client.hGetAll(
      `meta:request:${hash}`
    );

    return {
      response: (result as unknown as Record<string, any>).response,
      metadata: {
        projectId: metadata.projectId,
        organizationId: metadata.organizationId,
      },
    };
  }

  async cacheRequest(dto: CacheRequestDto): Promise<CacheRequestResult> {
    const { request, response } = dto;
    const hash = this.generateHash(request);

    await Promise.all([
      this.redisService.client
        .multi()
        .json.set(`request:${hash}`, ".", {
          response: { ...response },
        })
        .expire(`request:${hash}`, REQUEST_CACHE_TTL)
        .exec(),
      this.redisService.client
        .multi()
        .hSet(`meta:request:${hash}`, "projectId", dto.projectId)
        .hSet(`meta:request:${hash}`, "organizationId", dto.organizationId)
        .expire(`meta:request:${hash}`, REQUEST_CACHE_TTL)
        .exec(),
      this.redisService.client
        .multi()
        .sAdd(`index:organizationId:${dto.organizationId}`, hash)
        .sAdd(`index:projectId:${dto.projectId}`, hash)
        .exec(),
    ]);

    return {
      hash,
      exp: new Date(Date.now() + REQUEST_CACHE_TTL * 1000).toISOString(),
    };
  }
}
