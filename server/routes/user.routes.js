import { Router } from "express";
import {
  register,
  login,
  me,
  adminCreateUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { verifyUser, adminOnly } from "../middleware/auth.js";

const router = Router();

/* ===== AUTH ===== */
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyUser, me);

/* ===== ADMIN CRUD ===== */
router.post("/admin/users", verifyUser, adminOnly, adminCreateUser);
router.get("/admin/users", verifyUser, adminOnly, getAllUsers);
router.get("/admin/users/:id", verifyUser, adminOnly, getUserById);
router.put("/admin/users/:id", verifyUser, adminOnly, updateUser);
router.delete("/admin/users/:id", verifyUser, adminOnly, deleteUser);

export default router;
