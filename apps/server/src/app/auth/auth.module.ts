import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from "@nestjs/common";

import { AuthMiddleware } from "./auth.middleware";
import { SupertokensService } from "./supertokens.service";
import { AuthMethodsController } from "./auth-methods.controller";

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
      controllers: [AuthMethodsController],
      providers: [
        SupertokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
