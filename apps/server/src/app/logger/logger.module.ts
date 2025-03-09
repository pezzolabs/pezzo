import { Global, Module } from "@nestjs/common";
import { PinoLogger } from "./pino-logger";

@Global()
@Module({
  providers: [PinoLogger],
  exports: [PinoLogger],
})
export class LoggerModule {}
