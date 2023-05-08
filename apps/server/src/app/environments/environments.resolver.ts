import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Environment } from "../../@generated/environment/environment.model";
import { PrismaService } from "../prisma.service";
import { EnvironmentWhereUniqueInput } from "../../@generated/environment/environment-where-unique.input";
import { EnvironmentCreateInput } from "../../@generated/environment/environment-create.input";
import { ConflictException } from "@nestjs/common";

@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Environment])
  async environments() {
    const environments = await this.prisma.environment.findMany();
    return environments;
  }

  @Query(() => Environment)
  async environment(@Args("data") data: EnvironmentWhereUniqueInput) {
    const environment = await this.prisma.environment.findUnique({
      where: data,
    });
    return environment;
  }

  @Mutation(() => Environment)
  async createEnvironment(@Args("data") data: EnvironmentCreateInput) {
    const exists = await this.prisma.environment.findUnique({
      where: { slug: data.slug },
    });

    if (exists) {
      throw new ConflictException(
        `Environment with slug "${data.slug}" already exists`
      );
    }

    const environment = await this.prisma.environment.create({
      data,
    });

    return environment;
  }
}
