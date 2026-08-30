import { Router } from "express";
import { createStaffController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/staff" , authMiddleware, requireRole("ADMIN"),  createStaffController)

export default router