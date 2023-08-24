export interface FetchCachedRequestResult {
  hit: boolean;
  data: Record<string, any>;
}

export interface CacheRequestResult {
  hash: string;
  exp: string;
}

export interface CacheRequestDto {
  request: Record<string, any>;
  response: Record<string, any>;
  projectId: string;
  organizationId: string;
}

export interface CachedRequest {
  response: Record<string, any>;
  metadata: {
    projectId: string;
    organizationId: string;
  };
}
