const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const plans = [
  {
    code: "starter",
    name: "Starter",
    priceInr: 499,
    features: ["Limited widgets", "Limited matches", "Live score widgets"],
    widgetLimit: 2,
  },
  {
    code: "basic",
    name: "Basic",
    priceInr: 999,
    features: ["More matches", "Basic customization", "Playing XI"],
    widgetLimit: 5,
  },
  {
    code: "pro",
    name: "Pro",
    priceInr: 1999,
    features: ["Unlimited matches", "Unlimited widgets", "Timeline events"],
    widgetLimit: 999,
  },
  {
    code: "premium",
    name: "Premium",
    priceInr: 3999,
    features: [
      "Advanced widgets",
      "Priority features",
      "Weather + pitch reports",
      "Player statistics",
    ],
    widgetLimit: 999,
  },
];

const getPlans = asyncHandler(async (_req, res) => {
  res.status(200).json({ plans });
});

const subscribeToPlan = asyncHandler(async (req, res) => {
  const { planCode } = req.body;
  const selectedPlan = plans.find((plan) => plan.code === planCode);

  if (!selectedPlan) {
    res.status(400);
    throw new Error("Invalid plan selected");
  }

  const user = await User.findById(req.user._id);
  user.subscription = {
    plan: selectedPlan.code,
    status: "active",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  await user.save();

  res.status(200).json({
    message: `${selectedPlan.name} plan activated successfully`,
    subscription: user.subscription,
  });
});

module.exports = { getPlans, subscribeToPlan };
