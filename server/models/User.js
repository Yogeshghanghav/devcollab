const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "developer", "viewer"],
      default: "developer",
    },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    socketId: { type: String, default: null },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isOnline: this.isOnline,
    lastSeen: this.lastSeen,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);