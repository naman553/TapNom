import { Router } from "express";
import { createCategoryController, deleteCategoryController, getCategorieController , getCategory, updateCategoryController } from "../controllers/categoryController";
import { requireRole } from "../middleware/roleMiddleware";
import { canteenAccessMiddleware } from "../middleware/canteenAccessMiddleware";
import { resolveBodyCanteenId, resolveCanteenId } from "../middleware/canteenResolvers";
const router = Router();

router.post("/", canteenAccessMiddleware(resolveBodyCanteenId), createCategoryController);
router.get("/" ,getCategorieController );
router.get("/:id" , getCategory );
router.put("/:id",  canteenAccessMiddleware(resolveCanteenId), updateCategoryController);
router.delete("/:id",  requireRole("ADMIN"), deleteCategoryController);

export default router