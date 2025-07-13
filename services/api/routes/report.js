const { Router } = require("express");
const Report     = require("../controllers/report");

const router = Router();

router.get ('/bill/:id', Report.downloadBill);

module.exports = router;