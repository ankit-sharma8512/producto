const HTTPError = require("../utils/error");
const Producer  = require("../../../tools/kafka/producer");

const STOCK_UPDATES_TOPIC = 'stock-updates';

class StockController {
    static async updateStock(req, res) {
        try {
            const data = req.body;
            // need validation of data

            await Producer.publish(STOCK_UPDATES_TOPIC, data.productId, data);

            return res.json({"message":"Acknowledged"})
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = StockController;