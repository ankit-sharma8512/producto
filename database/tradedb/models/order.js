const HTTPError       = require("../utils/error");
const DB              = require("../connection/index");
const OrderSchema     = require("../schema/order");
const BillCountSchema = require("../schema/bill_count");
const {
    getCurrentFinancialYearFilter,
}                    = require("../utils/order");

class OrderModel {
    static #model;
    static #countModel;

    static async init() {
        this.#model      = DB.connection.model('order', OrderSchema);
        this.#countModel = DB.connection.model('bill_count', BillCountSchema);
    }

    static async getOrderList(filter = {}, options={}) {
        const result = await this.#model.find(filter, '-order', options).populate('buyerId').lean();

        return result;
    }

    static async getOrderCount(filter = {}) {
        const result = await this.#model.countDocuments(filter);

        return result;
    }

    static async getOrderDetail(id) {
        const result = await this.#model.findById(id, '-order').populate('buyerId').lean();

        if(!result)
            throw new HTTPError(404, 'ERR_NOT_FOUND', 'order not found');

        return result;
    }

    static async getOrderItems(id) {
        const result = await this.#model.findById(id, 'date order').lean();

        if(!result)
            throw new HTTPError(404, 'ERR_NOT_FOUND', 'order not found');

        return result;
    }

    static async makeNewBillNumber(date) {
        const { label } = getCurrentFinancialYearFilter(date);
        const result    = await this.#countModel.findOneAndUpdate({ fyear: label }, { $inc: { count: 1 } }, { returnDocument:'after', lean: true, upsert: true });

        return result;
    }

    static async createOrder(data) {
        const result = await this.#model.create(data);

        return result;
    }

    static async updateOrder(id, data) {
        const result = await this.#model.findByIdAndUpdate(id, data, { returnDocument:'after', lean: true });

        return result;
    }

    static async deleteOrder(id) {
        const order     = await this.getOrderDetail(id)
        const { label } = getCurrentFinancialYearFilter(order.date);

        await this.#countModel.findOneAndUpdate({ fyear: label }, { $inc: { count: -1 } }, { returnDocument:'after', lean: true });

        const result = await this.#model.findByIdAndDelete(id);

        return result;
    }

    static async addOrderItem(id, order) {
        const items = await this.getOrderItems(id)

        for(const item of items.order) {
            if(order.pid.toString() === item.pid.toString())
                throw new HTTPError(400, 'ERR_ALREADY_EXISTS', 'product id already exists');
        }

        const result = await this.#model.findByIdAndUpdate(id, { $push: { order } }, { returnDocument:'after', lean: true });

        return result;
    }

    static async updateOrderItem(id, order) {
        await this.getOrderDetail(id);

        const { pid, ...body } = order;
        const $set = {}
        for(const k in body) $set[`order.$.${k}`] = order[k];

        const result = await this.#model.updateOne({ _id:id, "order.pid": pid }, { $set }, { returnDocument:'after', lean: true, select:'order' });

        return result;
    }

    static async removeOrderItem(id, pid) {
        const result = await this.#model.findByIdAndUpdate(id, { $pull: { order: { pid } } }, { returnDocument:'after', lean: true });

        return result;
    }

    
}

module.exports = OrderModel;
