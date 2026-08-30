import { Router } from "express";
import { createCanteenController, deleteCanteenController, getCanteen, getCanteensController, updateCanteenController } from "../controllers/canteenController";
import { requireRole } from "../middleware/roleMiddleware";
import { canteenAccessMiddleware } from "../middleware/canteenAccessMiddleware";
import { resolveCanteenId } from "../middleware/canteenResolvers";

const router = Router();

router.post("/",  requireRole("ADMIN"),createCanteenController);
router.get("/", getCanteensController);
router.get("/:id", getCanteen);
router.put("/:id", canteenAccessMiddleware(resolveCanteenId), updateCanteenController);
router.delete("/:id", canteenAccessMiddleware(resolveCanteenId), deleteCanteenController);

export default router;