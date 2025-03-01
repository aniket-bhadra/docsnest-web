const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema(
  {
    _id: String,
    title: String,
    data: Object,
    userId: { type: Schema.Types.Mixed, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Document", DocumentSchema);
