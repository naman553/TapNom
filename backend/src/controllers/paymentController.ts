import type { Request, Response } from "express";
import { markCashPaymentAsPaid, markOnlinePaymentAsPaid, verifyRazorpayPayment } from "../services/paymentService";

export const markCashPaymentAsPaidController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    if (req.user.role !== "STAFF" || !req.user.canteenId) {
      res.status(403).json({
        success: false,
        message: "Staff access required"
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
      return;
    }

    const result = await markCashPaymentAsPaid(
      id,
      req.user.canteenId
    );

    if (result.error) {
      res.status(400).json({
        success: false,
        message: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cash payment marked as paid",
      data: result
    });
  } catch (error) {
    console.error("Error marking cash payment as paid:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment"
    });
  }
};



export const markOnlinePaymentAsPaidController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    const { paymentId } = req.params;

    if (typeof paymentId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid payment ID"
      });
      return;
    }

    const result = await markOnlinePaymentAsPaid(paymentId);

    if (result.error) {
      res.status(400).json({
        success: false,
        message: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Online payment successful",
      data: result
    });
  } catch (error) {
    console.error(
      "Error processing online payment:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to process online payment"
    });
  }
};



export const verifyRazorpayPaymentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid payment details"
      });
      return;
    }

    const result = await verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      req.user.userId
    );

    if (result.error) {
      res.status(400).json({
        success: false,
        message: result.error
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result
    });
  } catch (error) {
    console.error(
      "Error verifying Razorpay payment:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to verify payment"
    });
  }
};