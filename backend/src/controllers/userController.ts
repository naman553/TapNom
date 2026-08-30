import type { Request, Response } from "express";
import { createStaff } from "../services/userService";

export const createStaffController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const staff = await createStaff(req.body);

    if (!staff) {
      res.status(400).json({
        success: false,
        message: "Invalid data or canteen does not belong to college"
      });

      return;
    }

    res.status(201).json({
      success: true,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        collegeId: staff.collegeId,
        canteenId: staff.canteenId
      }
    });
  } catch (error) {
    console.error("Error creating staff:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create staff"
    });
  }
};