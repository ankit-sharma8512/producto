/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    await knex.schema.createTableIfNotExists("lots", table => {
        table.uuid      ("id")         .primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid      ("productid")  .notNullable().references("id").inTable("products").onDelete("CASCADE");
        table.string    ("purchaseid") .notNullable();
        table.timestamp ("date")       .notNullable();
        table.integer   ("quantity")   .notNullable();
        table.timestamp ("mfgdate")    .nullable();
        table.timestamp ("expdate")    .nullable();
        table.float     ("price")      .notNullable();

        table.timestamps(true, true);
        table.unique(["productid", "purchaseid"]);
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("lots")
};
