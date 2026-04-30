const ApiLog = require("../models/ApiLog");
const Alert = require("../models/Alert");

// ── Logs ─────────────────────────
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const logs = await ApiLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
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
      total,
      errors,
      errorRate: total ? (errors / total) * 100 : 0,
    });
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

// ✅ CLEAN EXPORT
module.exports = {
  getLogs,
  getStats,
  getAlerts,
  resolveAlert,
};