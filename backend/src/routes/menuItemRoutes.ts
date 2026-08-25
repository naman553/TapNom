import { Router } from "express";
import { createMenuItemController, deleteMenuItemController, getMenuItem, getMenuItemController, updateMenuItemController } from "../controllers/menuItemController";


const router = Router();

router.post("/", createMenuItemController);
router.get("/", getMenuItemController);
router.get("/:id", getMenuItem);
router.put("/:id", updateMenuItemController);
router.delete("/:id", deleteMenuItemController);

export default router