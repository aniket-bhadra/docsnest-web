const Document = require("../models/documentModel");
const User = require("../models/userModel");

const findOrCreateDocument = async ({ documentId, userId }) => {
  if (!documentId || !userId) return;

  const defaultValue = "";

  const existedDocument = await Document.findById(documentId);
  if (existedDocument) {
    // Convert to plain object and add owner
    const doc = existedDocument.toObject();
    doc.owner = await User.findById(existedDocument.userId);
    console.log("existing doc ", doc);
    return doc;
  }

  const newlyCreatedDocument = await Document.create({
    _id: documentId,
    data: defaultValue,
    userId,
  });

  // Convert to plain object and add owner
  const doc = newlyCreatedDocument.toObject();
  doc.owner = await User.findById(userId);
  console.log("new doc ", doc);

  return doc;
};

module.exports = {
  findOrCreateDocument,
};
