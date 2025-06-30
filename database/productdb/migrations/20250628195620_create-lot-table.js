/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    await knex.schema.createTableIfNotExists("lots", table => {
        table.uuid   ("id")         .primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid   ("productid")  .notNullable().references("id").inTable("products").onDelete("CASCADE");
        table.string ("purchaseid") .notNullable();
        table.string ("date")       .notNullable();
        table.string ("quantity")   .notNullable();
        table.date   ("mfgdate")    .nullable();
        table.date   ("expdate")    .nullable();
        table.float  ("price")      .notNullable();
        table.enum   ("type",       ["purchase", "return"]).defaultTo("purchase").notNullable();

        table.timestamps(true, true);
        table.unique(["productid", "purchaseid", "type"]);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("lots")
};
