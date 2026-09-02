import { Router } from "express";
import { createOrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getStaffOrdersController } from "../controllers/staffOrderController";
import { updateOrderStatusController } from "../controllers/orderStatusController";
import { verifyPickupPinController } from "../controllers/pickupController";
import { markCashPaymentAsPaidController, markOnlinePaymentAsPaidController, verifyRazorpayPaymentController } from "../controllers/paymentController";

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

router.post(
  "/:id/payment/cash",
  authMiddleware,
  markCashPaymentAsPaidController
);

router.post(
  "/payment/:paymentId/mock-success",
  authMiddleware,
  markOnlinePaymentAsPaidController
);


router.post(
  "/payment/verify",
  authMiddleware,
  verifyRazorpayPaymentController
);
export default router;