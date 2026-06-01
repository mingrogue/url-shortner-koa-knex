import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("users", (tableBuilder) => {
      tableBuilder.increments("id").primary();
      tableBuilder.string("username").notNullable().unique();
      tableBuilder.text("password").notNullable().unique();
      tableBuilder.timestamps(true, true);
    })
    .createTable("urls", (tableBuilder) => {
      tableBuilder
        .string("id")
        .defaultTo(knex.raw("substring(md5(random()::text) from 0 for 8)"))
        .primary();
      tableBuilder.text("url").notNullable();
      tableBuilder
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .notNullable();
      tableBuilder.timestamps(true, true);
    })
    .createTable("visits", (tableBuilder) => {
      tableBuilder.increments("id").primary();
      tableBuilder
        .string("url_id")
        .references("id")
        .inTable("urls")
        .onDelete("CASCADE")
        .notNullable();
      tableBuilder.string("ip").notNullable();
      tableBuilder.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("visits").dropTable("urls").dropTable("users");
}
