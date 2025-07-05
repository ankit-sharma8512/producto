const PurchaseModel = require("../models/purchase");
const OrderModel    = require("../models/order");

async function register() {
    await PurchaseModel.init();
    await OrderModel.init();
}

module.exports = register;