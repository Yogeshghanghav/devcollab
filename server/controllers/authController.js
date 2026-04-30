const User = require("../models/User");
const Channel = require("../models/Channel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);

    // First user becomes admin
    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? "admin" : role || "developer";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: assignedRole,
    });

    // Add user to default channels
    await Channel.updateMany(
      { isDefault: true },
      { $addToSet: { members: user._id } }
    );

    const token = generateToken(user);

    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);

    res.json({ token, user: user.toPublic() });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.toPublic());
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!["admin", "developer", "viewer"].includes(role))
      return res.status(400).json({ msg: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};