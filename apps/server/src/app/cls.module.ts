import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ClsMiddleware } from "./cls.middleware";

@Module({})
export class ClsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
