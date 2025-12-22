import { Router } from "express";
import {
  applyForJob,
  getCandidateApplications,
  getFirmApplications,
  getJobApplications,
  updateApplicationStatus
} from "../controllers/application.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Protected routes - Candidate
router.post("/applications/apply/:jobId", authenticateToken, applyForJob);
router.get("/applications/candidate/current", authenticateToken, getCandidateApplications);

// Protected routes - Firm
router.get("/applications/firm/current", authenticateToken, getFirmApplications);
router.get("/applications/job/:jobId", authenticateToken, getJobApplications);
router.put("/applications/:id/status", authenticateToken, updateApplicationStatus);

export default router;