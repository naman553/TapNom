import { Router } from "express";
import { createOrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getStaffOrdersController } from "../controllers/staffOrderController";
import { updateOrderStatusController } from "../controllers/orderStatusController";
import { verifyPickupPinController } from "../controllers/pickupController";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createOrderController
);

router.get(
  "/staff",
  authMiddleware,
  getStaffOrdersController
)

router.patch(
  "/:id/status",
  authMiddleware,
  updateOrderStatusController
)

router.post(
  "/:id/pickup/pin",
  authMiddleware,
  verifyPickupPinController
)
router.post(
  "/:id/pickup/qr",
  authMiddleware,
  verifyPickupPinController
)



export default router;