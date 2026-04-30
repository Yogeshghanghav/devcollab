const express = require("express");
const router = express.Router();
const {
  getLogs,
  getStats,
  getAlerts,
  resolveAlert,
} = require("../controllers/monitorController");
const { auth, requireRole } = require("../middleware/auth");

// Admin & developer only
router.get("/logs", auth, requireRole("admin", "developer"), getLogs);
router.get("/stats", auth, requireRole("admin", "developer"), getStats);
router.get("/alerts", auth, requireRole("admin", "developer"), getAlerts);
router.patch("/alerts/:id/resolve", auth, requireRole("admin"), resolveAlert);

module.exports = router;