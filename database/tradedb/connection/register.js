const PurchaseModel = require("../models/purchase");

async function register() {
    await PurchaseModel.init();
}

module.exports = register;