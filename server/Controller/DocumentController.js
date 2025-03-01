const Document = require("../models/documentModel");

const fetchAllDocuments = async (req, res) => {
  try {
    const existedDocuments = await Document.find({
      userId: req.body.userId,
    });
    res.status(200).json(existedDocuments);
  } catch (error) {
    res.status(400).json({ error: "something went wrong!" });
  }
};

// ! this controller in current setup is redundant
const createDocument = async (req, res) => {
  const { documentID, userID } = req.body;
  try {
    const newlyCreatedDocument = await Document.create({
      _id: documentID,
      data: defaultValue,
      userId: userID,
    });
    res.status(201).json({
      newlyCreatedDocument,
    });
  } catch (error) {
    res.status(400).json({ error: "something went wrong!" });
  }
};

module.exports = {
  fetchAllDocuments,
  createDocument,
};
