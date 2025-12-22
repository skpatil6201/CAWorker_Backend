"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firm_controller_1 = require("../controllers/firm.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/firms/register", firm_controller_1.registerFirm);
router.post("/firms/login", firm_controller_1.loginFirm);
// Protected routes - Admin only
router.get("/firms", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), firm_controller_1.getAllFirms);
router.get("/firms/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), firm_controller_1.getFirmById);
router.delete("/firms/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), firm_controller_1.deleteFirm);
// Protected routes - Firm or Admin
router.get("/firms/profile/me", auth_middleware_1.authenticateToken, firm_controller_1.getFirmProfile);
router.put("/firms/:id", auth_middleware_1.authenticateToken, firm_controller_1.updateFirm);
exports.default = router;
