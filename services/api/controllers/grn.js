const HTTPError = require("../utils/error");
const product   = require("../remote/product_service");

class GRNController {
    // GRN Controllers
    static async getGrnList(req, res) {
        try {
            const result = await product.getGrnList(req.query);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createGrn(req, res) {
        try {
            const result = await product.createGrn(req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = GRNController