const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", default: null },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // for DMs
    type: { type: String, enum: ["channel", "direct"], default: "channel" },
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);