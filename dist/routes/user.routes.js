"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes - Admin only
router.get("/users", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), user_controller_1.getAllUsers);
router.get("/users/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), user_controller_1.getUserById);
router.post("/users", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), user_controller_1.createUser);
router.put("/users/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), user_controller_1.updateUser);
router.delete("/users/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin'), user_controller_1.deleteUser);
exports.default = router;
