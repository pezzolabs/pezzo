import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /* Create report properties table */
  await knex.schema.createTable("reportProperties", (table) => {
    table.string("id").defaultTo(knex.raw("generateUUIDv4()"));
    table.string("reportId").references("id").inTable("reports");
    table.string("key");
    table.string("value");
  });
}

export async function down(knex: Knex): Promise<void> {
  /* Drop report properties table */
  await knex.schema.dropTable("reportProperties");
}
