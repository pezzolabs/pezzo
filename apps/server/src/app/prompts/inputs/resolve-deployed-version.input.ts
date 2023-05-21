import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ResolveDeployedVersionInput {
  @Field(() => String, { nullable: false })
  environmentSlug: string;
}
