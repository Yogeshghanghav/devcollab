const mongoose = require("mongoose");

const ApiLogSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, required: true },
    responseTime: { type: Number, required: true },
    ip: { type: String },
    userAgent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    requestBody: { type: Object, default: {} },
    errorMessage: { type: String, default: null },
    isError: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ FIXED (capital issue)
ApiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
ApiLogSchema.index({ createdAt: -1 });
ApiLogSchema.index({ isError: 1, createdAt: -1 });

module.exports = mongoose.model("ApiLog", ApiLogSchema);