import { Router } from "express";
import {
  getAllAdmins,
  getAdminById,
  loginAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from "../controllers/admin.controller";

const router = Router();

router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.post("/admins/login", loginAdmin);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);

export default router;