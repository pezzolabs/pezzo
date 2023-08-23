import { Injectable } from "@nestjs/common";
import { CacheRequestDto } from "@pezzo/client";
import { createHash } from "crypto";
import stableStringify from "json-stable-stringify";

export interface CachedRequestResult {
  projectId: string;
  data: object;
}

@Injectable()
export class CacheService {
  private cache: Map<string, any> = new Map();

  private generateHash(request: object): string {
    const stringified = stableStringify(request);
    const hash = createHash("sha256").update(stringified).digest("hex");
    return hash;
  }

  fetchRequest(request: object): CachedRequestResult | null {
    const hash = this.generateHash(request);

    if (this.cache.has(hash)) {
      return this.cache.get(hash);
    }

    return null;
  }

  cacheRequest(dto: CacheRequestDto): string {
    const { request, response } = dto;
    const hash = this.generateHash(request);

    this.cache.set(hash, {
      data: response,
    });
    return hash;
  }
}
