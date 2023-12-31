import { Knex } from "knex";
import clickhouse from "@pezzo/knex-clickhouse-dialect";

const {
  CLICKHOUSE_PROTOCOL = "http",
  CLICKHOUSE_HOST = "localhost",
  CLICKHOUSE_PORT = "8123",
  CLICKHOUSE_USER = "default",
  CLICKHOUSE_PASSWORD = "default",
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
