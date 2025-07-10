/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("sale", table => {
        table.uuid    ("id")          .primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid    ("productid")   .notNullable().references("id").inTable("products").onDelete("CASCADE");
        table.string  ("orderid")     .notNullable();
        table.timestamp('date')       .notNullable();
        table.integer ("quantity")    .notNullable();
        table.integer ("returned")    .defaultTo(0).notNullable();
        table.double  ("rate")        .notNullable(); // Complete Rate (actual + gst)
        table.double  ("cgst")        .notNullable(); // can use cgst and sgst to calc rate without gst
        table.double  ("sgst")        .notNullable();
        table.double  ("discount")    .notNullable();

        table.unique(["productid", "orderid"]);


        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("sale")

};
