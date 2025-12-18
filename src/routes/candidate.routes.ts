import { Router } from "express";
import {
  getAllCandidates,
  getCandidateById,
  registerCandidate,
  loginCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateProfile
} from "../controllers/candidate.controller";
import { candidateRegistrationValidator, candidateLoginValidator } from "../validators/candidate.validator";
import { handleValidationErrors } from "../middleware/validation.middleware";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/candidates/register", candidateRegistrationValidator, handleValidationErrors, registerCandidate);
router.post("/candidates/login", candidateLoginValidator, handleValidationErrors, loginCandidate);

// Protected routes - Admin only
router.get("/candidates", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getAllCandidates);
router.get("/candidates/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), getCandidateById);
router.delete("/candidates/:id", authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), deleteCandidate);

// Protected routes - Candidate or Admin
router.get("/candidates/profile/me", authenticateToken, getCandidateProfile);
router.put("/candidates/:id", authenticateToken, updateCandidate);

export default router;