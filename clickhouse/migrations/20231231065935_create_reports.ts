import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /* Create reports table */
  await knex.schema.createTable("reports", (table) => {
    table.string("id");
    table.dateTime("timestamp").nullable();
    table.string("environment").nullable();
    table.string("organizationId");
    table.string("projectId");
    table.specificType("promptTokens", "Float64").nullable();
    table.specificType("completionTokens", "Float64").nullable();
    table.specificType("totalTokens", "Float64").nullable();
    table.specificType("promptCost", "Float64").nullable();
    table.specificType("completionCost", "Float64").nullable();
    table.specificType("totalCost", "Float64").nullable();
    table.specificType("duration", "UInt32").nullable();
    table.string("type").nullable();
    table.string("client").nullable();
    table.string("clientVersion").nullable();
    table.string("model").nullable();
    table.string("provider").nullable();
    table.string("modelAuthor").nullable();
    table.dateTime("requestTimestamp").nullable();
    table.string("requestBody").nullable();
    table.boolean("isError").nullable();
    table.specificType("responseStatusCode", "UInt32").nullable();
    table.dateTime("responseTimestamp").nullable();
    table.string("responseBody").nullable();
    table.boolean("cacheEnabled").nullable();
    table.boolean("cacheHit").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  /* Drop reports table */
  await knex.schema.dropTable("reports");
}
