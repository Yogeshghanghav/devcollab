const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["high_error_rate", "slow_response", "api_down", "custom"],
      required: true,
    },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    message: { type: String, required: true },
    details: { type: Object, default: {} },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);