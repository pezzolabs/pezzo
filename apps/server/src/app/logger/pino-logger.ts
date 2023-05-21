import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONTEXT } from "@nestjs/graphql";
import { pino } from "pino";
import pinoHttp from "pino-http";

@Injectable({ scope: Scope.REQUEST })
export class PinoLogger {
  private logger: pino.Logger;

  constructor(
    @Inject(CONTEXT) private readonly context,
  ) {
    const pino = pinoHttp({
      genReqId: () => this.context.requestId,
      transport:
        process.env.PINO_PRETTIFY === "true"
          ? {
              target: "pino-pretty",
              options: {
                levelFirst: true,
                colorize: true,
              },
            }
          : undefined,
      quietReqLogger: true,
      redact: {
        paths: ["pid", "hostname", "res"],
      },
    });
    const logger = pino.logger;
    this.logger = logger.child({ requestId: this.context.requestId });
  }

  assign(obj: object) {
    this.logger = this.logger.child(obj);
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
