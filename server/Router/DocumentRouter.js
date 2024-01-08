const express = require("express");
const router = express.Router();

const { fetchAllDocuments } = require("../Controller/DocumentController");

router.route("/").get(fetchAllDocuments);

module.exports = router;
