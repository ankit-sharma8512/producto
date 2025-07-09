const PurchaseModel = require("../../../database/tradedb/models/purchase");
const HTTPError     = require("../utils/error");
const TProducer     = require("../../../tools/kafka/transactional-producer");
const RestClient    = require("../../../tools/zookeeper/rest_client");
 
// const Producer      = require("../../../tools/kafka/producer");
const product       = new RestClient('product');

const STOCK_TOPIC = 'stock-updates';

class PurchaseController {
    static async getPurchases(req, res) {
        try {
            const filter = req.query || {};

            const page   = Number(filter?.page || 1)
            const limit  = Number(filter?.limit || 10)

            if(page)  delete filter.page
            if(limit) delete filter.limit

            const results = await PurchaseModel.getPurchaseList(filter, {
                sort : { date: -1 },
                skip : (page-1)*limit,
                limit
            });

            const total   = await PurchaseModel.getPurchaseCount(filter);

            return res.json({
                results,
                pagination : {
                    page,
                    limit,
                    total
                }
            });
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getPurchaseDetail(req, res) {
        try {
            const {_id} = req.params;

            const results = await PurchaseModel.getPurchaseDetail(_id);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getPurchaseOrders(req, res) {
        try {
            const {_id} = req.params;

            const results = await PurchaseModel.getPurchaseOrders(_id);

            const products = await Promise.all(results.purchase.map(p => product.get(`/detail/${p.pid}`)))

            results.purchase.forEach((prod, i) => prod.pid = products[i])

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createPurchase(req, res) {
        try {
            const data = req.body;
            data.purchase = [];

            const results = await PurchaseModel.createPurchase(data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updatePurchase(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await PurchaseModel.updatePurchase(_id, data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async deletePurchase(req, res) {
        try {
            const {_id} = req.params;

            const results = await PurchaseModel.deletePurchase(_id);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addPurchaseOrder(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await PurchaseModel.addPurchaseOrder(_id, data);

            return res.json(results);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updatePurchaseOrder(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await PurchaseModel.updatePurchaseOrder(_id, data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async removePurchaseOrder(req, res) {
        try {
            const {_id, pid} = req.params;

            const results = await PurchaseModel.removePurchaseOrder(_id, pid);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async markComplete(req, res) {
        try {
            const {_id} = req.params;
            const purchase = await PurchaseModel.getPurchaseDetail(_id);

            if(purchase.state != 'DRAFT')
                throw new HTTPError(400, 'ERR_ALREADY_COMPLETED', 'purchase already completed');

            const data     = await PurchaseModel.getPurchaseOrders(_id);
            
            const messages = data?.purchase.map(p => ({
                purchaseId : _id,
                date   : data.date,
                action : "PURCHASE",
                ...p
            })).map(m => ({ key: m.pid, value: JSON.stringify(m) }));
            
            await PurchaseModel.markComplete(_id);
            await TProducer.publish(STOCK_TOPIC, messages);

            return res.send();
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = PurchaseController;