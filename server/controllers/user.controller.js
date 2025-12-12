import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/* ================== AUTH HELPERS ================== */
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIREY || "7d" }
  );

/* ================== AUTH ================== */

// Register (default user)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = signToken(user);

    res.status(201).json({
      message: "Registered",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      message: "Login success",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user
export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
};

/* ================== ADMIN CRUD ================== */

// CREATE user/admin
export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "user",
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
};

// READ single user
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

// UPDATE user
export const updateUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  const updateData = { name, email, role };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated", user });
};

// DELETE user
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
};
