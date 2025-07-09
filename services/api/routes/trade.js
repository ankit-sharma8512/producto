const { Router } = require("express");
const Trade      = require("../controllers/trade");

const router = Router();

// Purchase
router.get    ('/purchase/list',           Trade.getPurchases);
router.get    ('/purchase/detail/:id',     Trade.getPurchaseDetail);
router.post   ('/purchase/create',         Trade.createPurchase);
router.put    ('/purchase/update/:id',     Trade.updatePurchase);
router.delete ('/purchase/delete/:id',     Trade.deletePurchase);
router.post   ('/purchase/complete/:id',   Trade.markComplete);

router.get    ("/purchase/order/:id",      Trade.getPurchaseOrders);
router.post   ("/purchase/order/:id",      Trade.addPurchaseOrder);
router.put    ("/purchase/order/:id",      Trade.updatePurchaseOrder);
router.delete ("/purchase/order/:id/:pid", Trade.removePurchaseOrder);


// Order
router.get    ('/order/list',           Trade.getOrders);
router.get    ('/order/detail/:id',     Trade.getOrderDetail);
router.post   ('/order/create',         Trade.createOrder);
router.put    ('/order/update/:id',     Trade.updateOrder);
router.delete ('/order/delete/:id',     Trade.deleteOrder);
// router.post   ('/order/complete/:id',   Trade.markComplete);

router.get    ("/order/item/:id",      Trade.getOrderItems);
router.post   ("/order/item/:id",      Trade.addOrderItem);
router.put    ("/order/item/:id",      Trade.updateOrderItem);
router.delete ("/order/item/:id/:pid", Trade.removeOrderItem);


// router.get    ('/detail/:id', Product.getProduct);
// router.post   ('/create',     Product.createProduct);
// router.put    ('/update/:id', Product.updateProduct);
// router.delete ('/delete/:id', Product.deleteProduct);

// Lots
// router.get    ('/list/lot',       Product.getLots)
// router.get    ('/available/:id',  Product.getAvailable)

module.exports = router;