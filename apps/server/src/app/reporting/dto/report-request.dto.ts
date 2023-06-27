import { IsEnum, IsObject } from "class-validator";

enum Providers {
  openai = "openai",
}

enum Types {
  chat = "chat",
  completion = "completion",
}

export class ReportRequestDto {
  @IsEnum(Providers)
  provider: Providers;

  @IsEnum(Types)
  type: Types;

  @IsObject()
  properties: Record<string, unknown>;

  @IsObject()
  metadata: Record<string, unknown>;

  @IsObject()
  request: unknown;

  @IsObject()
  response: unknown;
}
