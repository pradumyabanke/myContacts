const express = require("express");
const {
  getPlans,
  subscribeToPlan,
} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/plans", getPlans);
router.post("/subscribe", protect, subscribeToPlan);

module.exports = router;
