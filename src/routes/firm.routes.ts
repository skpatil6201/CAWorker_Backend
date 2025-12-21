import { Router } from "express";
import {
  getAllFirms,
  getFirmById,
  registerFirm,
  loginFirm,
  updateFirm,
  deleteFirm,
  getFirmProfile
} from "../controllers/firm.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/firms/register", registerFirm);
router.post("/firms/login", loginFirm);

// Protected routes - Admin only
router.get("/firms", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getAllFirms);
router.get("/firms/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getFirmById);
router.delete("/firms/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), deleteFirm);

// Protected routes - Firm or Admin
router.get("/firms/profile/me", authenticateToken, getFirmProfile);
router.put("/firms/:id", authenticateToken, updateFirm);

export default router;