const knex       = require('knex');
const knexconfig = require("../knexfile")[process.env.NODE_ENV || 'development']
const db         = knex(knexconfig);

const TABLE_NAME = 'products';
const methods    = {};

methods.listProducts = async function() {
    const results = await db(TABLE_NAME)
        .select("*")
        .where({isDeleted:false})
        .limit(25);

    return results;
}

methods.createProduct = async function(data) {
    if(!data) throw new Error("Invalid data");

    const result = await db(TABLE_NAME)
        .insert(data)
        .returning("*");

    return result;
}

methods.getProduct = async function(id) {
    if(!id) throw new Error("Invalid ID");

    const result = await db(TABLE_NAME)
        .select("*")
        .where({id, isDeleted:false})
        .first();

    return result;
}

methods.updateProduct = async function(id, data) {
    if(!id) throw new Error("Invalid ID");

    const result = await db(TABLE_NAME)
        .where({id})
        .update(data)
        .returning("*");
    
    return result;
}

methods.deleteProduct = async function(id) {
    if(!id) throw new Error("Invalid ID");

    const result = await db(TABLE_NAME)
        .where({id})
        .update({ isDeleted:true })
        .returning("*");
    
    return result;
}

module.exports = methods;