/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await knex.schema.createTableIfNotExists("stock", table => {
        table.uuid   ("id")        .primary().references("id").inTable("products").onDelete("CASCADE");
        table.integer("available") .notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("stock")
};
