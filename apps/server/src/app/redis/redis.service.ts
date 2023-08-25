import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { pino } from "pino";
import { ConfigService } from "@nestjs/config";

import { createLogger } from "../logger/create-logger";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType;
  private logger: pino.Logger;

  constructor(private config: ConfigService) {
    this.logger = createLogger({
      scope: "RedisService",
    });
  }

  async onModuleInit() {
    this.client = createClient({
      url: this.config.get("REDIS_URL"),
      socket: {
        tls: this.config.get("REDIS_TLS_ENABLED"),
        reconnectStrategy: (retries) => {
          if (retries === 5) {
            this.logger.error("Redis connection failed");
            return process.exit(1);
          }

          return Math.min(retries * 50, 1000);
        },
      },
    });

    this.client.on("error", (error) => {
      this.logger.error({ error: error.message }, "Redis client error");
    });

    await this.client.connect();
    this.logger.info("Redis client connected");
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    this.logger.info("Redis client disconnected");
  }
}
