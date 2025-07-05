const { Router }         = require("express");
const OrderController    = require("../controller/order");

const router = Router();

router.get("/test", OrderController.test);
router.get("/test2", OrderController.test2)

module.exports = router;