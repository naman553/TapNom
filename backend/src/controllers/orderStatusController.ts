import type { Request, Response } from "express";
import { updateOrderStatus } from "../services/orderStatusService";

export const updateOrderStatusController = async (
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

    const  { id }  = req.params;
    if (typeof id !== "string") {
    res.status(400).json({
        success: false,
        message: "Invalid order ID"
    });
    return;
    }
    const { status } = req.body;

    if (typeof status !== "string") {
      res.status(400).json({
        success: false,
        message: "Status is required"
      });
      return;
    }

    const result = await updateOrderStatus(
      id,
      req.user.canteenId,
      status
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
      data: result.order
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};