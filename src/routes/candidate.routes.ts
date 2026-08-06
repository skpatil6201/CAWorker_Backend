import { Router } from "express";
import {
  getAllCandidates,
  getCandidateById,
  registerCandidate,
  loginCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateProfile,
  getCandidatesForFirm
} from "../controllers/candidate.controller";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/candidates/register", registerCandidate);
router.post("/candidates/login", loginCandidate);

// Protected routes - Admin or Firm
router.get("/candidates", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getAllCandidates);

// Protected routes - Authenticated users (all roles)
router.get("/candidates/firm", authenticateToken, getCandidatesForFirm);
router.get("/candidates/profile/me", authenticateToken, getCandidateProfile);

// Protected routes - Admin or Firm
router.get("/candidates/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getCandidateById);
router.delete("/candidates/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), deleteCandidate);
router.put("/candidates/:id", authenticateToken, updateCandidate);

export default router;