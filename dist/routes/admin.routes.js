"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/admins/login", admin_controller_1.loginAdmin);
// Protected routes - SuperAdmin only
router.get("/admins", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), admin_controller_1.getAllAdmins);
router.get("/admins/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), admin_controller_1.getAdminById);
router.post("/admins", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), admin_controller_1.createAdmin);
router.put("/admins/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), admin_controller_1.updateAdmin);
router.delete("/admins/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), admin_controller_1.deleteAdmin);
// Protected routes - Admin and SuperAdmin
router.get("/dashboard/stats", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), admin_controller_1.getDashboardStats);
router.put("/candidates/:id/status", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), admin_controller_1.updateCandidateStatus);
router.put("/firms/:id/status", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), admin_controller_1.updateFirmStatus);
exports.default = router;
