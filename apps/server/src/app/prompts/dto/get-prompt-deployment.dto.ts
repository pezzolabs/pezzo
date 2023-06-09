import { IsString } from "class-validator";

export class GetPromptDeploymentDto {
  @IsString()
  name: string;

  @IsString()
  environmentName: string;
}
