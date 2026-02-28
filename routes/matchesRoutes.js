const express = require("express");
const { getLiveMatches } = require("../controllers/matchesController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/live", protect, getLiveMatches);

module.exports = router;
