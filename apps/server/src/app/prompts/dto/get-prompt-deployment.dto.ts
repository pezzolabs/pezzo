import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetPromptDeploymentDto {
  @ApiProperty({
    description: "The name of the prompt (case sensitive)",
    type: String,
    example: "PromptName",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The name of the environment (case sensitive)",
    type: String,
    example: "Production",
  })
  @IsString()
  environmentName: string;
}
