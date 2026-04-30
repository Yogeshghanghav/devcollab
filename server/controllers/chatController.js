
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const User = require("../models/User");

// ── Channels ──────────────────────────────────────────────

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      $or: [{ type: "public" }, { members: req.user.id }],
    })
      .populate("createdBy", "name")
      .sort({ isDefault: -1, name: 1 });

    res.json(channels);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createChannel = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    if (!name) return res.status(400).json({ msg: "Channel name required" });

    const existing = await Channel.findOne({ name: name.toLowerCase() });
    if (existing) return res.status(409).json({ msg: "Channel already exists" });

    const channel = await Channel.create({
      name: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      type: type || "public",
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await channel.populate("createdBy", "name");
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.joinChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: req.user.id } },
      { new: true }
    );
    if (!channel) return res.status(404).json({ msg: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ── Messages ──────────────────────────────────────────────

exports.getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ channel: channelId, type: "channel" })
      .populate("user", "name avatar role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getDirectMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      type: "direct",
      $or: [
        { user: req.user.id, recipient: userId },
        { user: userId, recipient: req.user.id },
      ],
    })
      .populate("user", "name avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ type: "channel" })
      .populate("user", "name avatar role")
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};