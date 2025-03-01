const express = require("express");
const router = express.Router();

const {
  fetchAllDocuments,
  createDocument,
} = require("../Controller/DocumentController");

router.route("/all").post(fetchAllDocuments);
router.route("/").post(createDocument);

module.exports = router;
