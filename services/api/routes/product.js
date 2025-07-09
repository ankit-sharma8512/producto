const { Router } = require("express");
const Product    = require("../controllers/product");

const router = Router();

router.get    ('/list',       Product.getProducts);
router.get    ('/detail/:id', Product.getProduct);
router.post   ('/create',     Product.createProduct);
router.put    ('/update/:id', Product.updateProduct);
router.delete ('/delete/:id', Product.deleteProduct);

// Lots
router.get    ('/list/lot',       Product.getLots)
router.get    ('/available/:id',  Product.getAvailable)

module.exports = router;