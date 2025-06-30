const { Router }         = require("express");
const PurchaseController = require("../controller/purchase");

const router = Router();

// Primary purchase API's
router.get   ("/list",        PurchaseController.getPurchases);
router.get   ("/detail/:_id", PurchaseController.getPurchaseDetail);
router.post  ("/create",      PurchaseController.createPurchase);
router.put   ("/update/:_id", PurchaseController.updatePurchase);
router.delete("/delete/:_id", PurchaseController.deletePurchase);

// Purchase Order API's
router.get   ("/order/:_id",      PurchaseController.getPurchaseOrders);
router.post  ("/order/:_id",      PurchaseController.addPurchaseOrder);
router.put   ("/order/:_id",      PurchaseController.updatePurchaseOrder);
router.delete("/order/:_id/:pid", PurchaseController.removePurchaseOrder);

router.post("/complete/:_id", PurchaseController.markComplete);

module.exports = router;