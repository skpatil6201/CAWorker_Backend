"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const assignmentRequest_controller_1 = require("../controllers/assignmentRequest.controller");
const router = (0, express_1.Router)();
router.post('/assignment-requests', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('firm', 'Firm', 'SuperAdmin', 'Admin'), assignmentRequest_controller_1.createAssignmentRequest);
router.get('/assignment-requests/firm', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('firm', 'Firm', 'SuperAdmin', 'Admin'), assignmentRequest_controller_1.getFirmAssignmentRequests);
exports.default = router;
