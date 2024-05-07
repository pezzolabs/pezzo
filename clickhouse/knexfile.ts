import { Knex } from "knex";
import clickhouse from "@pezzo/knex-clickhouse-dialect";

const {
  CLICKHOUSE_PROTOCOL = "http",
  CLICKHOUSE_HOST = "smartnews-ops-0038ca8724e37848.elb.ap-northeast-1.amazonaws.com",
  CLICKHOUSE_PORT = "8123",
  CLICKHOUSE_USER = "llm_ops_sa",
  CLICKHOUSE_PASSWORD = "FyaNO3kQRJNUU5bl",
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
