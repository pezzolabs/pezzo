import { IsObject } from "class-validator";

export class CacheRequestDto {
  @IsObject()
  request: Record<string, any>;

  @IsObject()
  response: Record<string, any>;
}
