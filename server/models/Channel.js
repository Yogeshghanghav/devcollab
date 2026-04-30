const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["public", "private", "direct"], default: "public" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);