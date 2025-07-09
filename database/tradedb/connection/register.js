const PurchaseModel = require("../models/purchase");
const OrderModel    = require("../models/order");
const TraderModel   = require("../models/trader");

async function register() {
    await PurchaseModel.init();
    await OrderModel.init();
    await TraderModel.init();
}

module.exports = register;