const Document = require("../models/documentModel");

const findOrCreateDocument = async ({ documentId, userId }) => {
  if (!documentId || !userId) return;

  const defaultValue = "";

  const existedDocument = await Document.findById(documentId);
  if (existedDocument) return existedDocument;
  const newlyCreatedDocument = await Document.create({
    _id: documentId,
    data: defaultValue,
    userId,
  });
  console.log("new document created");
  return newlyCreatedDocument;
};

module.exports = {
  findOrCreateDocument,
};
