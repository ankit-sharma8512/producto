const HTTPError   = require("../utils/error.js")
const trade       = require("../remote/trade_service.js")

class TraderController {
  static async getBuyerList(req, res) {
    try {
      const result = await trade.listBuyer(req.query)

      return res.json(result);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }

  static async getVendorList(req, res) {
    try {
      const result = await trade.listVendor(req.query)

      return res.json(result);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }

  static async getTraderDetail(req, res) {
    try {
      const { _id } = req.params;

      const results = await trade.traderDetail(_id)
      return res.json(results);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }

  static async addTrader(req, res) {
    try {
      const data = req.body;

      const results = await trade.addTrader(data)
      return res.json(results);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }

  static async updateTrader(req, res) {
    try {
      const { _id } = req.params;
      const data = req.body;

      const results = await trade.updateTrader(_id, data)
      return res.json(results);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }

  static async deleteTrader(req, res) {
    try {
      const { _id } = req.params;

      const results = await trade.deleteTrader(_id);
      return res.json(results);
    }
    catch (err) {
      console.error(err)
      const error = err instanceof HTTPError ? err.error : new HTTPError().error;
      return res.status(error.status).json(error);
    }
  }
}

module.exports = TraderController;