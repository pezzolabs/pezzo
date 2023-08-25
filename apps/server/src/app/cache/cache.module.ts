import { Module } from "@nestjs/common";
import { CacheController } from "./cache.controller";
import { CacheService } from "./cache.service";
import { IdentityModule } from "../identity/identity.module";
import { AuthModule } from "../auth/auth.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [IdentityModule, AuthModule, RedisModule],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
