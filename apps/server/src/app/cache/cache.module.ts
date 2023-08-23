import { Module } from "@nestjs/common";
import { CacheController } from "./cache.controller";
import { CacheService } from "./cache.service";
import { IdentityModule } from "../identity/identity.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [IdentityModule, AuthModule],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
