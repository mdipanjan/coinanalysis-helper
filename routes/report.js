const express = require("express");
const router = express.Router();
const reportController = require("../controllers/generate.controller");

router.get("/generate-report", reportController.generateReport);

module.exports = router;
