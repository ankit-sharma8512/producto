const { Router } = require("express")
const ReportController = require("../controller/report");

const router = Router();

router.get('/bill/:id', ReportController.downloadBill);

module.exports = router;