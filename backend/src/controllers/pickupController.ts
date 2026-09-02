import type { Request,Response } from "express"
import { verifyPickupPin, verifyPickupQR } from "../services/pickupService";

export const verifyPickupPinController = async(
    req : Request,
    res : Response
): Promise <void> =>{
    try {
        if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    const { id } = req.params;
    const { pickupPin} = req.body ;
    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
      return;
    }
    if (typeof req.user.canteenId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
      return;
    }

    if (typeof pickupPin !== "string") {
      res.status(400).json({
        success: false,
        message: "Pickup PIN is required"
      });
      return;
    }

    const result = await verifyPickupPin(id ,req.user.canteenId, pickupPin);

    if(result.error){
        res.status(400).json({
            success: false ,
            message : result.error 
        })
        return ;
    }
    res.status(200).json({
      success: true,
      message: "Pickup verified successfully",
      data: result.order
    });
  } catch (error) {
    console.error("Error verifying pickup:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify pickup"
    });
  }
};


export const verifyPickupQRController = async (
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

    const { qrToken } = req.body;

    if (typeof qrToken !== "string") {
      res.status(400).json({
        success: false,
        message: "QR token is required"
      });
      return;
    }

    const result = await verifyPickupQR (
      qrToken,
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
      message: "Pickup verified successfully",
      data: result.order
    });
  } catch (error) {
    console.error("Error verifying QR pickup:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify QR pickup"
    });
  }
};