const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ["starter", "basic", "pro", "premium", "none"],
      default: "none",
    },
    status: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    resetOtpCode: {
      type: String,
      default: null,
    },
    resetOtpExpiresAt: {
      type: Date,
      default: null,
    },
    sessionToken: {
      type: String,
      default: null,
    },
    sessionExpiresAt: {
      type: Date,
      default: null,
    },
    subscription: {
      type: subscriptionSchema,
      default: () => ({}),
    },
    activeWidgets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
