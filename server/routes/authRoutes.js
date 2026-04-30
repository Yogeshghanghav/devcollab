const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  getUsers,
  updateRole,
} = require("../controllers/authController");
const { auth, requireRole } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.get("/users", auth, getUsers);
router.patch("/users/role", auth, requireRole("admin"), updateRole);

module.exports = router;