import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { EnvironmentsResolver } from "./environments.resolver";

@Module({
  providers: [
    PrismaService,
    EnvironmentsResolver
  ]
})
export class EnvironmentsModule {}