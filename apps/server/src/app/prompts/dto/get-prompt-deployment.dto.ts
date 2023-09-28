import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetPromptDeploymentDto {
  @ApiProperty({
    description: "The name of the prompt deployment",
    type: String,
    example: "my-prompt-deployment",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The name of the environment",
    type: String,
    example: "production",
  })
  @IsString()
  environmentName: string;
}
