const TraderModel = require("../../../database/tradedb/models/trader.js")
const HTTPError   = require("../utils/error.js")

class TraderController {
  static async getBuyerList(req, res) {
    try {
      const query = { isDeleted: false, type: 'buyer' };
      if (req.query.search)
        query.name = { $regex: req.query.search, $options: 'i' };
      if (req.query.isDeleted)
        query.isDeleted = true;

      const result = await TraderModel.getTraders(query || {});

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
      const query = { isDeleted: false, type: 'vendor' };
      if (req.query.search)
        query.name = { $regex: req.query.search, $options: 'i' };
      if (req.query.isDeleted)
        query.isDeleted = true;

      const result = await TraderModel.getTraders(query || {});

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

      const results = await TraderModel.getTraderDetail(_id);
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

      const results = await TraderModel.addTrader(data);
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

      const results = await TraderModel.updateTrader(_id, data);
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

      const results = await TraderModel.deleteTrader(_id);
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