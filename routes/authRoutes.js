const express = require("express");
const {
  registerUser,
  verifyRegistrationOtp,
  loginUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyRegistrationOtp);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
