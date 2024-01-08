const Document = require("../models/documentModel");

const fetchAllDocuments = async (req, res) => {
  try {
    const existedDocuments = await Document.find({});
    res.status(200).json(existedDocuments);
  } catch (error) {
    res.status(400).json({ error: "something went wrong!" });
  }
};

module.exports = {
  fetchAllDocuments,
};
