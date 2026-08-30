import { NextFunction, Request, Response } from "express"

export const requireRole = (role: string) =>{
    return (req: Request , res: Response, next : NextFunction) : void =>{
        if(!req.user || req.user.role !=role ){
            res.status(403).json({
        success: false,
        message: "Access denied"
            });

            return;
        }

        next();
    }
}