import type { Request, Response, NextFunction } from "express";

type CanteenIdResolver = (
  req: Request
) => Promise<string | null>;

export const canteenAccessMiddleware = (
  resolveCanteenId: CanteenIdResolver
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required"
        });

        return;
      }

      if (req.user.role === "ADMIN") {
        next();
        return;
      }

      if (req.user.role !== "STAFF") {
        res.status(403).json({
          success: false,
          message: "Access denied"
        });

        return;
      }

      const canteenId = await resolveCanteenId(req);

      if (!canteenId) {
        res.status(404).json({
          success: false,
          message: "Resource not found"
        });

        return;
      }

      if (req.user.canteenId !== canteenId) {
        res.status(403).json({
          success: false,
          message: "You do not have access to this canteen"
        });

        return;
      }

      next();
    } catch (error) {
      console.error("Canteen access check failed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to verify access"
      });
    }
  };
};