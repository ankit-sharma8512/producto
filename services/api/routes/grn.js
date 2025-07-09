const { Router } = require("express");
const GRN        = require("../controllers/grn");

const router = Router();

// GRN
router.get ("/list",   GRN.getGrnList);
router.post("/create", GRN.createGrn);

module.exports = router