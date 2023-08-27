import { IsObject } from "class-validator";

export class AddToDatasetDto {
  @IsObject()
  data: Record<string, any>[];
}