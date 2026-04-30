const express = require("express");
const router = express.Router();
const {
  getChannels,
  createChannel,
  joinChannel,
  getChannelMessages,
  getDirectMessages,
  getMessages,
} = require("../controllers/chatController");
const { auth, requireRole } = require("../middleware/auth");

// Legacy
router.get("/messages", auth, getMessages);

// Channels
router.get("/channels", auth, getChannels);
router.post("/channels", auth, requireRole("admin", "developer"), createChannel);
router.post("/channels/:channelId/join", auth, joinChannel);

// Messages
router.get("/channels/:channelId/messages", auth, getChannelMessages);
router.get("/dm/:userId", auth, getDirectMessages);

module.exports = router;