import { IsObject } from "class-validator";

export class RetrieveCacheRequestDto {
  @IsObject()
  request: Record<string, any>;
}
