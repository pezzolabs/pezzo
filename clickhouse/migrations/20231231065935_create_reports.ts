import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /* Create reports table */
  await knex.schema.createTable("reports", (table) => {
    table.string("id");
    table.dateTime("timestamp");
    table.string("environment");
    table.string("organizationId");
    table.string("projectId");
    table.specificType("promptTokens", "Float64");
    table.specificType("completionTokens", "Float64");
    table.specificType("totalTokens", "Float64");
    table.specificType("promptCost", "Float64");
    table.specificType("completionCost", "Float64");
    table.specificType("totalCost", "Float64");
    table.specificType("duration", "UInt32");
    table.string("type");
    table.string("client");
    table.string("clientVersion");
    table.string("model");
    table.string("provider");
    table.string("modelAuthor");
    table.dateTime("requestTimestamp");
    table.string("requestBody");
    table.boolean("isError");
    table.specificType("responseStatusCode", "UInt32");
    table.dateTime("responseTimestamp");
    table.string("responseBody");
    table.boolean("cacheEnabled");
    table.boolean("cacheHit");
  });
}

export async function down(knex: Knex): Promise<void> {
  /* Drop reports table */
  await knex.schema.dropTable("reports");
}
