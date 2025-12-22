import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  getFirmJobs,
  createJob,
  updateJob,
  deleteJob,
  closeJob
} from "../controllers/job.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);

// Protected routes - Firm only
router.get("/jobs/firm/current", authenticateToken, getFirmJobs);
router.post("/jobs", authenticateToken, createJob);
router.put("/jobs/:id", authenticateToken, updateJob);
router.delete("/jobs/:id", authenticateToken, deleteJob);
router.patch("/jobs/:id/close", authenticateToken, closeJob);

export default router;