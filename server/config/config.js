const Document = require("../models/documentModel");
const User = require("../models/userModel");
const randomTitles = [
  "My Notes",
  "New Draft",
  "Ideas",
  "Quick Thoughts",
  "Brainstorm",
  "Creative Sparks",
  "Mind Map",
  "Thought Dump",
  "Draft Board",
  "Notes Hub",
  "Fresh Thoughts",
];

const findOrCreateDocument = async ({ documentId, userId }) => {
  if (!documentId || !userId) return;

  const defaultValue = "";

  const existedDocument = await Document.findById(documentId);
  if (existedDocument) {
    // Convert to plain object and add owner
    const doc = existedDocument.toObject();
    doc.owner = await User.findById(existedDocument.userId);
    return doc;
  }

  const title = randomTitles[Math.floor(Math.random() * randomTitles.length)];

  const newlyCreatedDocument = await Document.create({
    _id: documentId,
    title,
    data: defaultValue,
    userId,
  });

  // Convert to plain object and add owner
  const doc = newlyCreatedDocument.toObject();
  doc.owner = await User.findById(userId);

  return doc;
};

module.exports = {
  findOrCreateDocument,
};
