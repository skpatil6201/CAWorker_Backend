import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Protected routes - Admin only
router.get("/users", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getAllUsers);
router.get("/users/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getUserById);
router.post("/users", authenticateToken, authorizeRoles('SuperAdmin'), createUser);
router.put("/users/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), updateUser);
router.delete("/users/:id", authenticateToken, authorizeRoles('SuperAdmin'), deleteUser);

export default router;
