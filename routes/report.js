const express = require("express");
const router = express.Router();
const reportController = require("../controllers/generate.controller");
const notionController = require("../controllers/generate.notion-database.controller");

router.get("/generate-report", reportController.generateReport);
// router.get("/create-db", notionController.createNotionDB);

module.exports = router;
