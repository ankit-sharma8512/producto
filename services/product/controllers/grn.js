const Producer      = require("../../../tools/kafka/producer");
const HTTPError     = require("../utils/error");
const grn_model     = require("../../../database/productdb/models/grn")

const STOCK_TOPIC = 'stock-updates';

class GRNController {
    static async getList(req, res) {
        try {
            const filter = req.query || {};

            const page   = Number(filter?.page || 1)
            const limit  = Number(filter?.limit || 10)

            const data  = await grn_model.getGrnList(filter.pid ?? null, page, limit)
            const total = await grn_model.getGrnCount(filter.pid ?? null)

            return res.json({
                results    : data,
                pagination : {
                    total,
                    page,
                    limit
                }
            });
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async create(req, res) {
        try {
            const data  = req.body;
            data.action = "GRN";

            await Producer.publish(STOCK_TOPIC, data.pid, data);

            return res.send();
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = GRNController;