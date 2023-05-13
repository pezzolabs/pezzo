import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { EnvironmentsResolver } from "./environments.resolver";
import { IdentityModule } from "../identity/identity.module";
import { EnvironmentsService } from "./environments.service";

@Module({
  imports: [IdentityModule],
  providers: [PrismaService, EnvironmentsResolver, EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
