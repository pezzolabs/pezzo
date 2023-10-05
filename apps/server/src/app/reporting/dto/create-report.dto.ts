import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import {
  Provider,
  ObservabilityRequest,
  ObservabilityResponse,
  RecursiveObject,
  Primitive,
} from "@pezzo/types";
import { ApiProperty } from "@nestjs/swagger";

export class PromptExecutionMetadataDto {
  @ApiProperty({
    description: "LLM provider",
    type: String,
    enum: Provider,
  })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({
    description: "Client name identifier",
    type: String,
    example: "pezzo-ts",
  })
  @IsString()
  client: string;

  @ApiProperty({
    description: "Client version",
    type: String,
    example: "0.4.11",
  })
  @IsString()
  clientVersion: string;

  @ApiProperty({
    description: "The name of the Environment (case sensitive)",
    type: String,
    example: "Production",
  })
  @IsString()
  environment: string;

  @ApiProperty({
    description: "The ID of the reported prompt (if managed)",
    required: false,
    type: String,
    example: "c41jd0s93j000ud7kg7vekhi3",
  })
  promptId: string;
}

export class ExecutionRequestDto<
  TProviderType extends Provider | unknown = unknown
> {
  @ApiProperty({
    description: "Request timestamp",
    type: Date,
    example: "2021-01-01T00:00:00.000Z",
  })
  @IsDateString()
  timestamp: ObservabilityRequest<TProviderType>["timestamp"];

  @ApiProperty({
    description: "Raw request body, as sent to the LLM",
    type: Object,
    additionalProperties: true,
  })
  @IsObject()
  body: ObservabilityRequest<TProviderType>["body"];
}

export class ExecutionResponseDto<
  TProviderType extends Provider | unknown = unknown
> {
  @ApiProperty({
    description: "Response timestamp",
    type: Date,
    example: "2021-01-01T00:00:00.000Z",
  })
  @IsDateString()
  timestamp: ObservabilityResponse<TProviderType>["timestamp"];

  @ApiProperty({
    description: "Raw response body, as received from the LLM",
    type: Object,
    additionalProperties: true,
  })
  @IsObject()
  body: ObservabilityResponse<TProviderType>["body"];
}

export class CreateReportDto<
  TProviderType extends Provider | unknown = unknown
> {
  @ApiProperty({
    description: "Metadata",
    type: PromptExecutionMetadataDto,
  })
  @ValidateNested({ each: true })
  metadata: PromptExecutionMetadataDto;

  @ApiProperty({
    description: "Additional properties to be associated with the report",
    type: Object,
    required: false,
    additionalProperties: true,
    example: { userId: "someUserId", traceId: "traceId" },
  })
  @IsObject()
  @IsOptional()
  properties?: RecursiveObject<Primitive>;

  @ApiProperty({
    type: ExecutionRequestDto,
  })
  @ValidateNested({ each: true })
  request: ExecutionRequestDto<TProviderType>;

  @ApiProperty({
    type: ExecutionResponseDto,
  })
  @IsObject()
  response: ExecutionResponseDto<TProviderType>;

  @ApiProperty({
    description: "Whether caching is enabled for the report",
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  cacheEnabled?: boolean = false;

  @ApiProperty({
    description: "Whether the report was generated from a cache hit or not",
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  cacheHit?: boolean = null;
}
