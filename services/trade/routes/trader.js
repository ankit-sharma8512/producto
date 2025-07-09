const { Router } =  require("express");
const TraderController = require("../controller/trader.js");

const traderRouter = Router();

traderRouter.get('/list/buyer',      TraderController.getBuyerList);
traderRouter.get('/list/vendor',     TraderController.getVendorList);
traderRouter.get('/detail/:_id',     TraderController.getTraderDetail);
traderRouter.post('/add',            TraderController.addTrader);
traderRouter.put('/update/:_id',     TraderController.updateTrader);
traderRouter.delete('/delete/:_id',  TraderController.deleteTrader);

module.exports = traderRouter