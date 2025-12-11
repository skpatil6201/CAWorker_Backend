import { Router } from "express";
import {
  getAllFirms,
  getFirmById,
  registerFirm,
  loginFirm,
  updateFirm,
  deleteFirm
} from "../controllers/firm.controller";

const router = Router();

router.get("/firms", getAllFirms);
router.get("/firms/:id", getFirmById);
router.post("/firms/register", registerFirm);
router.post("/firms/login", loginFirm);
router.put("/firms/:id", updateFirm);
router.delete("/firms/:id", deleteFirm);

export default router;