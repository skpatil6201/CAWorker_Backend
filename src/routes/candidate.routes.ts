import { Router } from "express";
import {
  getAllCandidates,
  getCandidateById,
  registerCandidate,
  loginCandidate,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidate.controller";

const router = Router();

router.get("/candidates", getAllCandidates);
router.get("/candidates/:id", getCandidateById);
router.post("/candidates/register", registerCandidate);
router.post("/candidates/login", loginCandidate);
router.put("/candidates/:id", updateCandidate);
router.delete("/candidates/:id", deleteCandidate);

export default router;