import { ConfigService } from "@nestjs/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { createLogger } from "../logger/create-logger";
import { pino } from "pino";
import { createClient, ClickHouseClient } from "@clickhouse/client"; // or '@clickhouse/client-web'
import { knex, Knex } from "knex";
import clickhouesDialect from "@pezzo/knex-clickhouse-dialect";

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
    // const host = this.config.get("CLICKHOUSE_HOST");
    const host = "llm-ops-clickhouse";
    // const port = this.config.get("CLICKHOUSE_PORT");
    const port = 8123;
    // const username = this.config.get("CLICKHOUSE_USER");
    const username = "default";
    // const password = this.config.get("CLICKHOUSE_PASSWORD");
    const password = "default";
    // const protocol = this.config.get("CLICKHOUSE_PROTOCOL");
    const protocol = "http";
    const database = "default";

    this.logger.info("Creating ClickHouse client");
    this.logger.info({ host, port, username, password, protocol, database });

    this.client = createClient({
      host: `${protocol}://${host}:${port}`,
      username,
      password,
      database,
    });

    this.logger.info("Creating Knex instance");
    const connectionStr =
      `${protocol}://${username}:${password}@${host}:${port}/${database}` as any;

    this.knex = knex({
      client: clickhouesDialect as any,
      connection: () => connectionStr,
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
      this.logger.error({ error }, "ClickHouse client healthcheck failed");
      throw error;
    }

    try {
      await this.knex.raw("SELECT 1");
    } catch (error) {
      this.logger.error({ error }, "Knex healthcheck failed");
      throw error;
    }
  }
}
