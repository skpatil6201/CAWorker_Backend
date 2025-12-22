"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/jobs", job_controller_1.getAllJobs);
router.get("/jobs/:id", job_controller_1.getJobById);
// Protected routes - Firm only
router.get("/jobs/firm/current", auth_middleware_1.authenticateToken, job_controller_1.getFirmJobs);
router.post("/jobs", auth_middleware_1.authenticateToken, job_controller_1.createJob);
router.put("/jobs/:id", auth_middleware_1.authenticateToken, job_controller_1.updateJob);
router.delete("/jobs/:id", auth_middleware_1.authenticateToken, job_controller_1.deleteJob);
router.patch("/jobs/:id/close", auth_middleware_1.authenticateToken, job_controller_1.closeJob);
exports.default = router;
