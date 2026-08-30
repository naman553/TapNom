import { Router } from "express";
import { createMenuItemController, deleteMenuItemController, getMenuItem, getMenuItemController, updateMenuItemController } from "../controllers/menuItemController";
import { requireRole } from "../middleware/roleMiddleware";
import { canteenAccessMiddleware } from "../middleware/canteenAccessMiddleware";
import { resolveBodyCanteenId, resolveCanteenId } from "../middleware/canteenResolvers";


const router = Router();

router.post("/", canteenAccessMiddleware(resolveBodyCanteenId), createMenuItemController);
router.get("/", getMenuItemController);
router.get("/:id", getMenuItem);
router.put("/:id", canteenAccessMiddleware(resolveCanteenId), updateMenuItemController);
router.delete("/:id", canteenAccessMiddleware(resolveCanteenId), deleteMenuItemController);

export default router