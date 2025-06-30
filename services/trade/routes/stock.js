const { Router }      = require('express');
const StockController = require("../controller/stock");

const router = Router();

router.post('/update', StockController.updateStock);

module.exports = router;

