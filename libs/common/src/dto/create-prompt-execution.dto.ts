import { PromptExecutionStatus } from "@prisma/client";
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePromptExecutionDto {
  @IsString()
  promptId: string;

  @IsString()
  environmentName: string;

  @IsString()
  promptVersionSha: string;

  @IsEnum(PromptExecutionStatus)
  status: PromptExecutionStatus;

  @IsObject()
  settings: Record<string, unknown>;

  @IsObject()
  variables: Record<string, unknown>;

  @IsString()
  content: string;

  @IsString()
  interpolatedContent: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  completionCost: number;

  @IsNumber()
  completionTokens: number;

  @IsNumber()
  promptCost: number;

  @IsNumber()
  promptTokens: number;

  @IsNumber()
  totalTokens: number;

  @IsNumber()
  totalCost: number;
}
