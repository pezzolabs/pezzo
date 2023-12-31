import { Knex } from "knex";
import clickhouse from "@pezzo/knex-clickhouse-dialect";

const {
  CLICKHOUSE_HOST = "localhost",
  CLICKHOUSE_PORT = "8123",
  CLICKHOUSE_USER = "default",
  CLICKHOUSE_PASSWORD = "default",
} = process.env;

const str = `https://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}/default`;

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
