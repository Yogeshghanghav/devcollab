require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");
const seedChannels = require("./utils/seed");

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Connect DB
  await connectDB();

  // Seed default channels
  await seedChannels();

  // Create HTTP server (no app yet)
  const server = http.createServer();

  // Create Socket.io
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Both required INSIDE start(), after io is ready
  const requestLogger = require("./middleware/requestLogger");
  const app = require("./app");

  // Register logger BEFORE attaching app to server
  app.use(requestLogger(io));

  // Attach Express app to HTTP server
  server.on("request", app);

  // Make io accessible in controllers
  app.set("io", io);

  // Socket handler
  socketHandler(io);

  server.listen(PORT, () => {
    console.log(`\n🚀 DevCollab Server running on port ${PORT}`);
    console.log(`⚡ WebSocket ready`);
    console.log(`🌐 Accepting connections from ${process.env.CLIENT_URL}\n`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => process.exit(0));
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});