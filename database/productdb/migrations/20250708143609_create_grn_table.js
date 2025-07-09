/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("grn", table => {
        table.uuid   ("id")         .primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid   ("productid")  .notNullable().references("id").inTable("products").onDelete("CASCADE");
        table.string ("quantity")   .notNullable();
        table.enum   ("type",       ["positive", "negative"]).defaultTo("positive").notNullable();

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("grn")
};
