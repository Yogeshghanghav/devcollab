const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token) return next(new Error("Authentication required"));

      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      };

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });
  io.on("connection", async (socket) => {
    const { id: userId, name, role } = socket.user;

    console.log(` ${name} connected`);
    onlineUsers.set(userId, {
      socketId: socket.id,
      name,
      role,
    });

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      socketId: socket.id,
    });
    io.emit(
      "presence_update",
      Array.from(onlineUsers.entries()).map(([id, data]) => ({
        id,
        ...data,
      }))
    );
    try {
      const channels = await Channel.find({
        $or: [{ type: "public" }, { members: userId }],
      });

      channels.forEach((ch) => {
        socket.join(`channel:${ch._id}`);
      });
    } catch (err) {
      console.error("Auto join error:", err);
    }
    socket.on("join_channel", (channelId) => {
      if (!channelId) return;
      socket.join(`channel:${channelId}`);
    });
    socket.on("send_channel_message", async ({ channelId, text }) => {
      try {
        if (!text?.trim()) return;

        const channel = await Channel.findById(channelId);
        if (!channel) {
          return socket.emit("error", { msg: "Channel not found" });
        }
        if (
          channel.type === "private" &&
          !channel.members.includes(userId)
        ) {
          return socket.emit("error", { msg: "Access denied" });
        }

        const msg = await Message.create({
          user: userId,
          userName: name,
          text: text.trim(),
          channel: channelId,
          type: "channel",
        });

        const populated = await msg.populate("user", "name avatar role");

        io.to(`channel:${channelId}`).emit(
          "receive_channel_message",
          populated
        );
      } catch (err) {
        console.error("Message error:", err);
        socket.emit("error", { msg: "Failed to send message" });
      }
    });
    socket.on("send_direct_message", async ({ recipientId, text }) => {
      try {
        if (!text?.trim()) return;

        const msg = await Message.create({
          user: userId,
          userName: name,
          text: text.trim(),
          recipient: recipientId,
          type: "direct",
        });

        const populated = await msg.populate("user", "name avatar role");

        const recipient = onlineUsers.get(recipientId);

        if (recipient) {
          io.to(recipient.socketId).emit(
            "receive_direct_message",
            populated
          );
        }

        socket.emit("receive_direct_message", populated);
      } catch (err) {
        socket.emit("error", { msg: "Failed to send message" });
      }
    });
    socket.on("typing_start", ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit("user_typing", {
        userId,
        name,
      });
    });

    socket.on("typing_stop", ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit("user_stopped_typing", {
        userId,
      });
    });
    socket.on("disconnect", async () => {
      console.log(` ${name} disconnected`);

      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null,
      });

      io.emit(
        "presence_update",
        Array.from(onlineUsers.entries()).map(([id, data]) => ({
          id,
          ...data,
        }))
      );
    });
  });
};

module.exports = socketHandler;