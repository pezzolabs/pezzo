import { IsOptional, IsString } from "class-validator";

export class GetPromptDeploymentDto {
  @IsString()
  name: string;

  @IsString()
  environmentName: string;

  @IsString()
  @IsOptional() // Backwards compatibility - https://github.com/pezzolabs/pezzo/issues/224
  projectId: string;
}
