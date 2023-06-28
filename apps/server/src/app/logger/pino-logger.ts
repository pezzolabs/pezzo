import { Inject, Injectable, Scope } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";
import { pino } from "pino";
import { createLogger } from "./create-logger";

@Injectable({ scope: Scope.REQUEST })
export class PinoLogger {
  private logger: pino.Logger;

  constructor(
    @Inject(CONTEXT)
    private readonly context = { requestId: null, logger: null }
  ) {
    const logger = createLogger({ requestId: this.context.requestId });
    this.setLogger(logger);
  }

  private setLogger(logger: pino.Logger) {
    this.logger = logger;
    this.context.logger = logger;
    return logger;
  }

  assign(obj: object) {
    const child = this.logger.child(obj);
    return this.setLogger(child);
  }

  info<T extends object>(obj: T, msg?: string): void;
  info(msg: string): void;
  info(obj: any, msg?: any): void {
    if (typeof obj === "string") {
      this.logger.info(obj);
    } else {
      this.logger.info(obj, msg);
    }
  }

  error<T extends object>(obj: T, msg?: string): void;
  error(msg: string): void;
  error(obj: any, msg?: any): void {
    if (typeof obj === "string") {
      this.logger.error(obj);
    } else {
      this.logger.error(obj, msg);
    }
  }

  warn<T extends object>(obj: T, msg?: string): void;
  warn(msg: string): void;
  warn(obj: any, msg?: any): void {
    if (typeof obj === "string") {
      this.logger.warn(obj);
    } else {
      this.logger.warn(obj, msg);
    }
  }

  debug<T extends object>(obj: T, msg?: string): void;
  debug(msg: string): void;
  debug(obj: any, msg?: any): void {
    if (typeof obj === "string") {
      this.logger.debug(obj);
    } else {
      this.logger.debug(obj, msg);
    }
  }

  trace<T extends object>(obj: T, msg?: string): void;
  trace(msg: string): void;
  trace(obj: any, msg?: any): void {
    if (typeof obj === "string") {
      this.logger.trace(obj);
    } else {
      this.logger.trace(obj, msg);
    }
  }
}
