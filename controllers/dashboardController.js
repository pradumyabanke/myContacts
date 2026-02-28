const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "name email subscription activeWidgets"
  );

  const hasActiveSubscription =
    user.subscription.status === "active" &&
    user.subscription.expiresAt &&
    user.subscription.expiresAt > new Date();

  res.status(200).json({
    user,
    hasActiveSubscription,
    redirectToPlanSelection: !hasActiveSubscription,
  });
});

module.exports = { getDashboard };
