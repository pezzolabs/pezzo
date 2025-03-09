import { IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RetrieveCacheRequestDto {
  @ApiProperty({
    description: "The request object to retrieve from cache",
    type: Object,
    additionalProperties: true,
    example: { key1: "value1", key2: "value2" },
  })
  @IsObject()
  request: Record<string, any>;
}
