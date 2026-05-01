const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Authenticate ──────────────────────────────────────────
const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// ── Role Guard ────────────────────────────────────────────
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ msg: "Insufficient permissions" });
    }
    next();
  };
};

module.exports = { auth, requireRole };