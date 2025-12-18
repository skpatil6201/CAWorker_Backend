"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_controller_1 = require("../controllers/candidate.controller");
const candidate_validator_1 = require("../validators/candidate.validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/candidates/register", candidate_validator_1.candidateRegistrationValidator, validation_middleware_1.handleValidationErrors, candidate_controller_1.registerCandidate);
router.post("/candidates/login", candidate_validator_1.candidateLoginValidator, validation_middleware_1.handleValidationErrors, candidate_controller_1.loginCandidate);
// Protected routes - Admin only
router.get("/candidates", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), candidate_controller_1.getAllCandidates);
router.get("/candidates/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), candidate_controller_1.getCandidateById);
router.delete("/candidates/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('SuperAdmin', 'Admin'), candidate_controller_1.deleteCandidate);
// Protected routes - Candidate or Admin
router.get("/candidates/profile/me", auth_middleware_1.authenticateToken, candidate_controller_1.getCandidateProfile);
router.put("/candidates/:id", auth_middleware_1.authenticateToken, candidate_controller_1.updateCandidate);
exports.default = router;
