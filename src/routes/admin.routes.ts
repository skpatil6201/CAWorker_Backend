import { Router } from "express";
import {
  getAllAdmins,
  getAdminById,
  loginAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  updateCandidateStatus,
  updateFirmStatus
} from "../controllers/admin.controller";
import { adminLoginValidator, adminCreateValidator } from "../validators/admin.validator";
import { handleValidationErrors } from "../middleware/validation.middleware";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/admins/login", adminLoginValidator, handleValidationErrors, loginAdmin);

// Protected routes - SuperAdmin only
router.get("/admins", authenticateToken, authorizeRoles('SuperAdmin'), getAllAdmins);
router.get("/admins/:id", authenticateToken, authorizeRoles('SuperAdmin'), getAdminById);
router.post("/admins", authenticateToken, authorizeRoles('SuperAdmin'), adminCreateValidator, handleValidationErrors, createAdmin);
router.put("/admins/:id", authenticateToken, authorizeRoles('SuperAdmin'), updateAdmin);
router.delete("/admins/:id", authenticateToken, authorizeRoles('SuperAdmin'), deleteAdmin);

// Protected routes - Admin and SuperAdmin
router.get("/dashboard/stats", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getDashboardStats);
router.put("/candidates/:id/status", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), updateCandidateStatus);
router.put("/firms/:id/status", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), updateFirmStatus);

export default router;