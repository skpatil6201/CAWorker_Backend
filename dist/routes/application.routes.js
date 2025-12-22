"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes - Candidate
router.post("/applications/apply/:jobId", auth_middleware_1.authenticateToken, application_controller_1.applyForJob);
router.get("/applications/candidate/current", auth_middleware_1.authenticateToken, application_controller_1.getCandidateApplications);
// Protected routes - Firm
router.get("/applications/firm/current", auth_middleware_1.authenticateToken, application_controller_1.getFirmApplications);
router.get("/applications/job/:jobId", auth_middleware_1.authenticateToken, application_controller_1.getJobApplications);
router.put("/applications/:id/status", auth_middleware_1.authenticateToken, application_controller_1.updateApplicationStatus);
exports.default = router;
