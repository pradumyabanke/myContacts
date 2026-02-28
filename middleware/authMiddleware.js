const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token is missing");
  }

  const token = authHeader.split(" ")[1];

  const user = await User.findOne({
    sessionToken: token,
    sessionExpiresAt: { $gt: new Date() },
  }).select("-passwordHash -otpCode -resetOtpCode");

  if (!user) {
    res.status(401);
    throw new Error("Invalid or expired session token");
  }

  req.user = user;
  next();
});

module.exports = { protect };
