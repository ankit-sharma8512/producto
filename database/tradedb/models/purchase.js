const HTTPError      = require("../utils/error");
const DB             = require("../connection/index");
const PurchaseSchema = require("../schema/purchase");

class PurchaseModel {
    static #model;

    static async init() {
        this.#model = DB.connection.model('purchase', PurchaseSchema);
    }

    static async getPurchaseList(filter={}, options={}) {
        const result = await this.#model.find(filter, '-purchase', options).populate('vendorId').lean();

        return result;
    }

    static async getPurchaseCount(filter) {
        const result = await this.#model.countDocuments(filter);

        return result;
    }

    static async getPurchaseDetail(_id) {
        const result = await this.#model.findById(_id, '-purchase').populate('vendorId').lean();

        if(!result)
            throw new HTTPError(404, 'ERR_NOT_FOUND', "Purchase not found");

        return result;
    }

    static async getPurchaseOrders(_id) {
        const result = await this.#model.findById(_id, 'purchase date').lean();

        if(!result)
            throw new HTTPError(404, 'ERR_NOT_FOUND', "Purchase not found");

        return result;
    }

    static async createPurchase(data) {
        const result = await this.#model.create(data);

        return result;
    }

    static async updatePurchase(_id, data) {
        await this.getPurchaseDetail(_id);

        const res    = await this.#model.findByIdAndUpdate(_id, data, { returnDocument: 'after', lean: true });
        return res;
    }

    static async deletePurchase(_id) {
        const result = await this.getPurchaseDetail(_id);

        await this.#model.findByIdAndDelete(_id);
        return result;
    }

    static async addPurchaseOrder(_id, order) {
        const result = await this.getPurchaseOrders(_id);

        if(result?.purchase.map(p => p.pid.toString()).includes(order.pid.toString()))
            throw new HTTPError(400, 'ERR_ALREADY_EXISTS', "Product already exists");

        const res = await this.#model.findByIdAndUpdate(_id, { $push: { purchase: order } }, { returnDocument: 'after', lean: true, select:'purchase' });
        return res;
    }

    static async updatePurchaseOrder(_id, order) {
        await this.getPurchaseOrders(_id);

        const { pid, ...body } = order;
        const $set = {}
        for(const k in body) $set[`purchase.$.${k}`] = order[k];

        const res = await this.#model.updateOne({ _id, "purchase.pid": pid }, { $set }, { returnDocument:'after', lean: true, select:'purchase' });

        return res;
    }

    static async removePurchaseOrder(_id, pid) {
        await this.getPurchaseOrders(_id);

        const res = await this.#model.findByIdAndUpdate(_id, { $pull: { purchase: {pid} } }, { returnDocument:'after', lean: true, select:'purchase' });
        return res;
    }

    static async markComplete(_id) {
        const purchase = await this.#model.findByIdAndUpdate(_id, { $set: { state:'COMPLETED' } }, { returnDocument:'after', lean: true, select:'-purchase' })

        return purchase;
    }
}

module.exports = PurchaseModel;