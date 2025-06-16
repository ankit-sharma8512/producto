const { Router }        = require("express");
const ProductController = require('../controllers/product');

const router = Router();

router.get    ('/list',       ProductController.list);
router.post   ('/create',     ProductController.create);
router.get    ('/detail/:id', ProductController.detail);
router.put    ('/update/:id', ProductController.update);
router.delete ('/delete/:id', ProductController.delete);

module.exports = router;