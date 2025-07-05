const HTTPError       = require("../utils/error");
const DB              = require("../connection/index");
const OrderSchema     = require("../schema/order");
const BillCountSchema = require("../schema/bill_count");
const {
    getCurrentFinancialYearFilter,
    getBillNo
}                    = require("../utils/order");

class OrderModel {
    static #model;
    static #countModel;

    static async init() {
        this.#model      = DB.connection.model('order', OrderSchema);
        this.#countModel = DB.connection.model('bill_count', BillCountSchema);
    }

    static async getOrderList(filter = {}, options={}) {
        const result = await this.#model.find(filter, '-order', options).lean();

        return result;
    }

    
}

module.exports = OrderModel;
