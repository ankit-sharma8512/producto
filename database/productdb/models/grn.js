const knex       = require('knex');
const knexconfig = require("../knexfile")[process.env.NODE_ENV || 'development']
const db         = knex(knexconfig);

const methods        = {};
const GRN_TABLE_NAME = 'grn';

methods.getGrnList = async function(pid = null, page=1, limit=20) {

    const results = await db(GRN_TABLE_NAME)
        .select("grn.*", "products.name as name", "products.brand as brand")
        .join('products', 'grn.productid', 'products.id')
        .modify(query => {
            if(pid) query.where('grn.productid', pid)
        })
        .offset((page-1)*limit)
        .limit(limit);

    return results;
}

methods.getGrnCount = async function(pid = null) {
    const query = {};
    if(pid) query.pid = pid;

    const {count} = await db(GRN_TABLE_NAME)
        .where(query)
        .count("* as count");

    return count;
}

module.exports = methods;