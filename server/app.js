const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: "Too many requests, please try again later" },
});

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/monitor", monitorRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "running",
    app: "DevCollab API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handler
app.use(errorHandler);

module.exports = app;