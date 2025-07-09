const knex       = require('knex');
const knexconfig = require("../knexfile")[process.env.NODE_ENV || 'development']
const db         = knex(knexconfig);

const TABLE_NAME       = 'products';
const LOT_TABLE_NAME   = 'lots'
const STOCK_TABLE_NAME = 'stock'
const methods        = {};

methods.listProducts = async function() {
    const results = await db(TABLE_NAME)
        .select("*")
        .where({isdeleted:false})
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
        .where({id, isdeleted:false})
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
        .update({ isdeleted:true })
        .returning("*");
    
    return result;
}

methods.getLots = async function(productid) {
    if(!productid) throw new Error("Invalid ID");

    const result = await db(LOT_TABLE_NAME)
        .where({productid})
        .returning("*")

    return result;
}

methods.getAvailable = async function(id) {
    if(!id) throw new Error("Invalid ID");

    const result = await db(STOCK_TABLE_NAME)
        .select(["id","available"])
        .where({id})
        .first()

    if(!result) return {id, available: 0}

    return result;
}

module.exports = methods;