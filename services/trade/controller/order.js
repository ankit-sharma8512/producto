// const products = require("../../../products.json");
const HTTPError     = require("../utils/error");
const TProducer     = require("../../../tools/kafka/transactional-producer");
const OrderModel    = require("../../../database/tradedb/models/order");
const RestClient    = require("../../../tools/zookeeper/rest_client");
const { getBillNo } = require("../../../database/tradedb/utils/order");

const product       = new RestClient('product');
const STOCK_TOPIC   = 'stock-updates';

class OrderController {
    static async getOrders(req, res) {
        try {
            const filter = req.query || {};

            const page   = Number(filter?.page || 1)
            const limit  = Number(filter?.limit || 10)

            if(page)  delete filter.page
            if(limit) delete filter.limit

            const results = await OrderModel.getOrderList(filter, {
                sort : { date: -1 },
                skip : (page-1)*limit,
                limit
            });

            const total   = await OrderModel.getOrderCount(filter);

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

    static async getOrderDetail(req, res) {
        try {
            const {_id} = req.params;

            const results = await OrderModel.getOrderDetail(_id);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getOrderItems(req, res) {
        try {
            const {_id} = req.params;

            const results = await OrderModel.getOrderItems(_id);

            const products = await Promise.all(results.order.map(p => product.get(`/detail/${p.pid}`)))

            results.order.forEach((prod, i) => prod.pid = products[i])

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createOrder(req, res) {
        try {
            const data = req.body;
            data.order = [];

            const { count, fyear } = await OrderModel.makeNewBillNumber(data.date ?? new Date().toISOString());
            const billNo           = getBillNo(count, fyear, data.date ?? new Date().toISOString());
            data.billNo            = billNo;

            const results = await OrderModel.createOrder(data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updateOrder(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await OrderModel.updateOrder(_id, data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async deleteOrder(req, res) {
        try {
            const {_id} = req.params;

            const results = await OrderModel.deleteOrder(_id);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addOrderItem(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await OrderModel.addOrderItem(_id, data);

            return res.json(results);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updateOrderItem(req, res) {
        try {
            const {_id} = req.params;
            const data  = req.body;

            const results = await OrderModel.updateOrderItem(_id, data);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async removeOrderItem(req, res) {
        try {
            const {_id, pid} = req.params;

            const results = await OrderModel.removeOrderItem(_id, pid);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async processOrder(req, res) {
        try {
            const {_id} = req.params;

            // need to verify if the order is already processed here
            // ask whther sale lots are already present for this order.. if yes.. ignore kafka push again

            const order   = await OrderModel.getOrderDetail(_id);
            const results = await OrderModel.getOrderItems(_id);

            const messages = results?.order.map((p,i) => ({
                ...p,
                orderId  : _id,
                date     : order.date || new Date().toISOString(),
                action   : "ORDER",
                count    : results?.order.length
            }))
            .map(m => ({ key: m.pid, value: JSON.stringify(m) }));

            // console.log(messages)

            if(messages && messages?.length > 0)
                await TProducer.publish(STOCK_TOPIC, messages);

            await OrderModel.markProcessing(_id);

            return res.json(messages);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async markProcessed(message) {
        try {
            const data = JSON.parse(message)
            if(data.state === 'ACCEPTED')
                await OrderModel.markProcessed(data.orderId);
            else
                await OrderModel.markRejected(data.orderId);
        }
        catch(e) {
            console.log(err)
            // TODO: push to some dead letter queue to be processed later..
            console.log("Failed to mark order processed");
        }
    }

    static async executeReturn(req, res) {
        try {
            const {_id} = req.params;

            const results = await OrderModel.getReturnItems(_id);
            const messages = results?.map((p,i) => ({
                ...p,
                orderId  : _id,
                action   : "RETURN"
            }))
            .map(m => ({ key: m.pid, value: JSON.stringify(m) }));

            if(messages && messages?.length > 0)
                await TProducer.publish(STOCK_TOPIC, messages);

            await OrderModel.markReturned(_id);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addPayment(req, res) {
        try {
            const {_id}    = req.params;
            const {amount} = req.body

            const result = await OrderModel.addPayment(_id, amount || 0);

            return res.json(result);
        }
        catch(e) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = OrderController;