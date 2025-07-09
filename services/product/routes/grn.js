const { Router }    = require('express');
const GRNController = require('../controllers/grn');

const router = Router()

router.get ('/list',   GRNController.getList);
router.post('/create', GRNController.create)

module.exports = router;