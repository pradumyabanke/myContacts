const asyncHandler = require("express-async-handler");

const liveMatches = [
  {
    matchId: "IND-AUS-ODI-01",
    teams: "India vs Australia",
    score: "India 247/6",
    overs: "43.2",
    liveStatus: "Live",
    crr: "5.70",
    rrr: "6.10",
  },
  {
    matchId: "ENG-SA-T20-02",
    teams: "England vs South Africa",
    score: "South Africa 88/2",
    overs: "10.1",
    liveStatus: "Live",
    crr: "8.65",
    rrr: "9.20",
  },
  {
    matchId: "PAK-NZ-TEST-01",
    teams: "Pakistan vs New Zealand",
    score: "New Zealand 312/7",
    overs: "98.0",
    liveStatus: "Stumps",
    crr: "3.18",
    rrr: "-",
  },
];

const getLiveMatches = asyncHandler(async (_req, res) => {
  res.status(200).json({ source: "simulated-feed", matches: liveMatches });
});

module.exports = { getLiveMatches };
