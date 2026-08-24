import { Router } from "express";
import { createCanteenController, deleteCanteenController, getCanteen, getCanteensController, updateCanteenController } from "../controllers/canteenController";

const router = Router();

router.post("/", createCanteenController);
router.get("/", getCanteensController);
router.get("/:id", getCanteen);
router.put("/:id", updateCanteenController);
router.delete("/:id", deleteCanteenController);

export default router;