const ApiLog = require("../models/ApiLog");
const Alert = require("../models/Alert");

// ── Logs ─────────────────────────
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      ApiLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ApiLog.countDocuments(),
    ]);

    res.json({ logs, total });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ── Stats ────────────────────────
const getStats = async (req, res) => {
  try {
    const total = await ApiLog.countDocuments();
    const errors = await ApiLog.countDocuments({ isError: true });

    res.json({
  summary: {
    total24h: total,
    errors24h: errors,
    errorRate24h: total ? +((errors / total) * 100).toFixed(1) : 0,
    avgResponseTime: null, // add real calc if you have duration data
  }
})
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ── Alerts ───────────────────────
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.json(alert);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getLogs,
  getStats,
  getAlerts,
  resolveAlert,
};