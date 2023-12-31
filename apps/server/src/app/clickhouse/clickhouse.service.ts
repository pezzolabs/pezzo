import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { createLogger } from "../logger/create-logger";
import { pino } from "pino";
import { createClient, ClickHouseClient } from "@clickhouse/client"; // or '@clickhouse/client-web'
import { knex, Knex } from "knex";

@Injectable()
export class ClickHouseService implements OnModuleInit {
  public client: ClickHouseClient;
  public knex: Knex;
  private logger: pino.Logger;
  public requestsIndexAlias: string;

  constructor(private config: ConfigService) {
    this.logger = createLogger({
      scope: "ClickHouseService",
    });
  }

  async onModuleInit() {
    const host = this.config.get("CLICKHOUSE_HOST");
    const port = this.config.get("CLICKHOUSE_PORT");
    const username = this.config.get("CLICKHOUSE_USER");
    const password = this.config.get("CLICKHOUSE_PASSWORD");
    const protocol = this.config.get("CLICKHOUSE_PROTOCOL");
    const database = "default";

    this.logger.info("Creating ClickHouse client");

    this.client = createClient({
      host: `${protocol}://${host}:${port}`,
      username,
      password,
      database,
    });

    this.logger.info("Creating Knex instance");

    this.knex = knex({
      client: "mysql2",
      connection: {
        host,
        port: 9004,
        user: username,
        password,
        database,
        timezone: "Z",
      },
    });

    await this.healthCheck();
  }

  async healthCheck() {
    try {
      await this.client.query({
        query: "SELECT 1",
        format: "JSONEachRow",
      });
    } catch (error) {
      this.logger.error({ error }, "ClickHouse healthcheck failed");
      throw error;
    }
  }
}
