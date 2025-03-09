import { IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CacheRequestDto {
  @ApiProperty({
    description: "The request object to cache",
    type: Object,
    additionalProperties: true,
    example: { key1: "value1", key2: "value2" },
  })
  @IsObject()
  request: Record<string, any>;

  @ApiProperty({
    description: "The response object to cache",
    type: Object,
    additionalProperties: true,
    example: { key1: "value1", key2: "value2" },
  })
  @IsObject()
  response: Record<string, any>;
}
