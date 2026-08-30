import type { Request, Response } from "express";
import { createOrder } from "../services/orderService";

export const createOrderController = async (
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

    const order = await createOrder(
      req.user.userId,
      req.body
    );

    if (!order) {
      res.status(400).json({
        success: false,
        message: "Invalid canteen or menu items"
      });

      return;
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
};