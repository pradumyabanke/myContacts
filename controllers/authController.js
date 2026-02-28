const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/userModel");

const OTP_VALIDITY_MINUTES = 10;
const SESSION_VALIDITY_DAYS = 7;

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000);

  const user = await User.create({
    name,
    email,
    passwordHash: hashPassword(password),
    otpCode,
    otpExpiresAt,
  });

  res.status(201).json({
    message: "Registration successful. Verify OTP to activate account.",
    userId: user._id,
    devOtp: otpCode,
  });
});

const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    res.status(400);
    throw new Error("OTP expired. Please register again or request new OTP.");
  }

  if (user.otpCode !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  res.status(200).json({ message: "Account verified successfully." });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Account is not verified");
  }

  if (user.passwordHash !== hashPassword(password || "")) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const sessionToken = crypto.randomBytes(24).toString("hex");
  user.sessionToken = sessionToken;
  user.sessionExpiresAt = new Date(
    Date.now() + SESSION_VALIDITY_DAYS * 24 * 60 * 60 * 1000
  );
  await user.save();

  res.status(200).json({
    message: "Login successful",
    token: sessionToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otpCode = generateOtp();
  user.resetOtpCode = otpCode;
  user.resetOtpExpiresAt = new Date(
    Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000
  );
  await user.save();

  res.status(200).json({
    message: "Reset OTP generated",
    devOtp: otpCode,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    !user.resetOtpCode ||
    !user.resetOtpExpiresAt ||
    user.resetOtpExpiresAt < new Date()
  ) {
    res.status(400);
    throw new Error("Reset OTP expired");
  }

  if (user.resetOtpCode !== otp) {
    res.status(400);
    throw new Error("Invalid reset OTP");
  }

  user.passwordHash = hashPassword(newPassword || "");
  user.resetOtpCode = null;
  user.resetOtpExpiresAt = null;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

module.exports = {
  registerUser,
  verifyRegistrationOtp,
  loginUser,
  requestPasswordReset,
  resetPassword,
};
