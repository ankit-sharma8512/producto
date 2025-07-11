const HTTPError = require("../utils/error");
const trade     = require("../remote/trade_service");

class TradeController {
    static async getPurchases(req, res) {
        try {
            const result = await trade.getPurchases(req.query);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getPurchaseDetail(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.getPurchaseDetail(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createPurchase(req, res) {
        try {
            const result = await trade.createPurchase(req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updatePurchase(req, res) {
        try {
            const {id} = req.params
            const result = await trade.updatePurchase(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async deletePurchase(req, res) {
        try {
            const { id } = req.params
            const result = await trade.deletePurchase(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async markComplete(req, res) {
        try {
            const { id } = req.params
            const result = await trade.markComplete(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getPurchaseOrders(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.getPurchaseOrders(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addPurchaseOrder(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.addPurchaseOrder(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updatePurchaseOrder(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.updatePurchaseOrder(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async removePurchaseOrder(req, res) {
        try {
            const {id, pid} = req.params;
            const result = await trade.deletePurchaseOrder(id, pid);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    // Order Controllers
    static async getOrders(req, res) {
        try {
            const result = await trade.getOrders(req.query);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getOrderDetail(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.getOrderDetail(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createOrder(req, res) {
        try {
            const result = await trade.createOrder(req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updateOrder(req, res) {
        try {
            const {id} = req.params
            const result = await trade.updateOrder(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async deleteOrder(req, res) {
        try {
            const { id } = req.params
            const result = await trade.deleteOrder(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    // static async markComplete(req, res) {
    //     try {
    //         const { id } = req.params
    //         const result = await trade.markComplete(id);
    //         return res.status(200).json(result);
    //     }
    //     catch(err) {
    //         const error = err instanceof HTTPError ? err.error : new HTTPError().error;
    //         return res.status(error.status).json(error);
    //     }
    // }

    static async getOrderItems(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.getOrderItems(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addOrderItem(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.addOrderItem(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updateOrderItem(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.updateOrderItem(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async removeOrderItem(req, res) {
        try {
            const {id, pid} = req.params;
            const result = await trade.removeOrderItem(id, pid);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async processOrder(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.processOrder(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async executeReturn(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.executeReturn(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async addPayment(req, res) {
        try {
            const {id} = req.params;
            const result = await trade.addPayment(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = TradeController;