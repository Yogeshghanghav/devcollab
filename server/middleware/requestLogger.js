const ApiLog = require("../models/ApiLog");
const Alert = require("../models/Alert");

const SKIP_PATHS = ["/", "/favicon.ico", "/health"];

const ERROR_RATE_THRESHOLD = 20; // % errors in window
const SLOW_RESPONSE_THRESHOLD = 2000; // ms
const ALERT_WINDOW = 5 * 60 * 1000; // 5 minutes

let recentRequests = [];

const checkAlerts = async (log, io) => {
  const now = Date.now();
  recentRequests.push({
    time: now,
    isError: log.isError,
    responseTime: log.responseTime,
  });

  recentRequests = recentRequests.filter((r) => now - r.time < ALERT_WINDOW);

  const total = recentRequests.length;
  if (total < 10) return;

  const errors = recentRequests.filter((r) => r.isError).length;
  const errorRate = (errors / total) * 100;

  if (errorRate >= ERROR_RATE_THRESHOLD) {
    const recent = await Alert.findOne({
      type: "high_error_rate",
      resolved: false,
      createdAt: { $gte: new Date(now - ALERT_WINDOW) },
    });

    if (!recent) {
      const alert = await Alert.create({
        type: "high_error_rate",
        severity: errorRate >= 50 ? "critical" : "high",
        message: `High error rate detected: ${errorRate.toFixed(1)}% of recent requests failed`,
        details: { errorRate, total, errors, window: "5 minutes" },
      });

      if (io) io.emit("new_alert", alert);
    }
  }

  if (log.responseTime >= SLOW_RESPONSE_THRESHOLD) {
    const recent = await Alert.findOne({
      type: "slow_response",
      resolved: false,
      createdAt: { $gte: new Date(now - ALERT_WINDOW) },
    });

    if (!recent) {
      const alert = await Alert.create({
        type: "slow_response",
        severity: log.responseTime >= 5000 ? "high" : "medium",
        message: `Slow response detected: ${log.path} took ${log.responseTime}ms`,
        details: {
          path: log.path,
          method: log.method,
          responseTime: log.responseTime,
        },
      });

      if (io) io.emit("new_alert", alert);
    }
  }
};

const requestLogger = (io) => async (req, res, next) => {
  if (SKIP_PATHS.includes(req.path)) return next();

  const start = Date.now();

  const originalJson = res.json.bind(res);
  let responseBody = null;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", async () => {
    try {
      const responseTime = Date.now() - start;
      const isError = res.statusCode >= 400;

      const sanitizedBody = { ...req.body };
      delete sanitizedBody.password;
      delete sanitizedBody.confirmPassword;

      const log = await ApiLog.create({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        userId: req.user?.id || null,
        requestBody: sanitizedBody,
        errorMessage: isError ? responseBody?.msg || null : null,
        isError,
      });

      checkAlerts(log, io).catch(console.error);
    } catch (err) {
      console.error("Logger error:", err);
    }
  });

  next();
};

module.exports = requestLogger;