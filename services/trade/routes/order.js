const { Router }         = require("express");
const OrderController    = require("../controller/order");

const router = Router();

// Primary order API's
router.get   ("/list",        OrderController.getOrders);
router.get   ("/detail/:_id", OrderController.getOrderDetail);
router.post  ("/create",      OrderController.createOrder);
router.put   ("/update/:_id", OrderController.updateOrder);
router.delete("/delete/:_id", OrderController.deleteOrder);

// Order items API's
router.get   ("/item/:_id",      OrderController.getOrderItems);
router.post  ("/item/:_id",      OrderController.addOrderItem);
router.put   ("/item/:_id",      OrderController.updateOrderItem);
router.delete("/item/:_id/:pid", OrderController.removeOrderItem);

router.post  ("/process/:_id", OrderController.processOrder);
router.post  ("/return/:_id",  OrderController.executeReturn);
router.post  ("/payment/:_id", OrderController.addPayment);
// router.get("/test2", OrderController.test2)

module.exports = router;