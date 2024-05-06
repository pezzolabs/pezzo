import { Knex } from "knex";
import clickhouse from "@pezzo/knex-clickhouse-dialect";

const {
  CLICKHOUSE_PROTOCOL = "http",
  CLICKHOUSE_HOST = "clickhouse.dev.smartnews.com",
  CLICKHOUSE_PORT = "8123",
  CLICKHOUSE_USER = "test",
  CLICKHOUSE_PASSWORD = "test",
  CLICKHOUSE_DATABASE = "default",
} = process.env;

const str = `${CLICKHOUSE_PROTOCOL}://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}/${CLICKHOUSE_DATABASE}`;

const config: { [key: string]: Knex.Config } = {
  default: {
    client: clickhouse as any,
    connection: () => str as any,
    migrations: {
      disableTransactions: true,
      disableMigrationsListValidation: true,
    },
  },
};

module.exports = config;
