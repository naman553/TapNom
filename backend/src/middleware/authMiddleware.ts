import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) : void =>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
              res.status(401).json({
        success: false,
        message: "Authentication required"
      });

      return;
        }

        const token = authHeader.split(" ")[1];

         if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });

      return;
    }


   

    const payload = jwt.verify(
  token,
  process.env.JWT_SECRET!
) as {
  userId: string;
  role: string;
  canteenId?: string;
};

req.user = {
  userId: payload.userId,
  role: payload.role
};

next();


    } catch (error) {
        res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });    
    }
}