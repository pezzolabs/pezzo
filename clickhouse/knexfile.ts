import { Knex } from "knex";
import clickhouse from "@pezzo/knex-clickhouse-dialect";

const {
  CLICKHOUSE_HOST = "localhost",
  CLICKHOUSE_PORT = "8123",
  CLICKHOUSE_USER = "default",
  CLICKHOUSE_PASSWORD = "default",
} = process.env;

const config: { [key: string]: Knex.Config } = {
  default: {
    client: clickhouse as any,
    connection: () =>
      `clickhouse://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}/default` as any,
    migrations: {
      disableTransactions: true,
      disableMigrationsListValidation: true,
    },
  },
};

module.exports = config;
