import { Router } from "express";
import { createCategoryController, deleteCategoryController, getCategorieController , getCategory, updateCategoryController } from "../controllers/categoryController";
const router = Router();

router.post("/",createCategoryController);
router.get("/" ,getCategorieController );
router.get("/:id" , getCategory );
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router