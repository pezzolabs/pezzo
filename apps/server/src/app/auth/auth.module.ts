import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from "@nestjs/common";

import { AuthMiddleware } from "./auth.middleware";
import { SupertokensService } from "./supertokens.service";
import { IdentityModule } from "../identity/identity.module";

@Module({
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }

  static forRoot(): DynamicModule {
    return {
      providers: [SupertokensService],
      exports: [],
      imports: [IdentityModule],
      module: AuthModule,
    };
  }
}
