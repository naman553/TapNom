import { Router } from "express";
import { createOrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createOrderController
);

export default router;