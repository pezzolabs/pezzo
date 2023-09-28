import { PromptExecutionStatus } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePromptExecutionDto {
  @ApiProperty({
    description: "The timestamp of the prompt execution",
    type: String,
    format: "date-time",
    example: "2022-01-01T00:00:00Z",
  })
  @IsDateString()
  timestamp: string;

  @ApiProperty({
    description: "The ID of the environment",
    type: String,
    example: "env-123",
  })
  @IsString()
  environmentId: string;

  @ApiProperty({
    description: "The SHA of the prompt version",
    type: String,
    example: "abc123",
  })
  @IsString()
  promptVersionSha: string;

  @ApiProperty({
    description: "The status of the prompt execution",
    enum: PromptExecutionStatus,
    example: PromptExecutionStatus.Success,
  })
  @IsEnum(PromptExecutionStatus)
  status: PromptExecutionStatus;

  @ApiProperty({
    description: "The settings used for the prompt execution",
    type: Object,
    additionalProperties: true,
    example: { setting1: "value1", setting2: "value2" },
  })
  @IsObject()
  settings: Record<string, unknown>;

  @ApiProperty({
    description: "The variables used for the prompt execution",
    type: Object,
    additionalProperties: true,
    example: { variable1: "value1", variable2: "value2" },
  })
  @IsObject()
  variables: Record<string, unknown>;

  @ApiProperty({
    description: "The content of the prompt execution",
    type: String,
    example: "Hello, world!",
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: "The interpolated content of the prompt execution",
    type: String,
    example: "Hello, John!",
  })
  @IsString()
  interpolatedContent: string;

  @ApiProperty({
    description: "The result of the prompt execution",
    type: String,
    example: "Success",
    required: false,
  })
  @IsOptional()
  @IsString()
  result?: string;

  @ApiProperty({
    description: "The error message of the prompt execution",
    type: String,
    example: "Error",
    required: false,
  })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiProperty({
    description: "The duration of the prompt execution in milliseconds",
    type: Number,
    example: 1000,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: "The cost of completing the prompt execution",
    type: Number,
    example: 10,
  })
  @IsNumber()
  completionCost: number;

  @ApiProperty({
    description: "The number of tokens used to complete the prompt execution",
    type: Number,
    example: 1,
  })
  @IsNumber()
  completionTokens: number;

  @ApiProperty({
    description: "The cost of the prompt",
    type: Number,
    example: 5,
  })
  @IsNumber()
  promptCost: number;

  @ApiProperty({
    description: "The number of tokens used by the prompt",
    type: Number,
    example: 1,
  })
  @IsNumber()
  promptTokens: number;

  @ApiProperty({
    description: "The total number of tokens used",
    type: Number,
    example: 2,
  })
  @IsNumber()
  totalTokens: number;

  @ApiProperty({
    description: "The total cost of the prompt execution",
    type: Number,
    example: 15,
  })
  @IsNumber()
  totalCost: number;
}
