import type { Request, Response } from "express";
import { getStaffOrders } from "../services/staffOrderService";

export const getStaffOrdersController = async (
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

    const orders = await getStaffOrders(req.user.canteenId);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Error fetching staff orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch staff orders"
    });
  }
};
