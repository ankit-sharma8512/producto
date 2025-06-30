/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTableIfNotExists("products", table => {
      table.uuid("id").primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string("brand").notNullable();
      table.string("name").notNullable();
      table.string("hsn").notNullable();
      table.integer("mrp").notNullable();
      table.boolean("isdeleted").defaultTo(false).notNullable();
      table.timestamps(true, true);
  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("products")
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";');
};
