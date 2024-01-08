const Document = require("../models/documentModel");

const findOrCreateDocument = async (documentID) => {
  if (!documentID) return;

  const defaultValue = "";

  const existedDocument = await Document.findById(documentID);
  if (existedDocument) return existedDocument;
  const newlyCreatedDocument = await Document.create({
    _id: documentID,
    data: defaultValue,
  });
  return newlyCreatedDocument;
};

module.exports = {
  findOrCreateDocument,
};
