import { Router } from "express";
import { getColleges, createCollegeController, getCollege ,deleteCollegeController ,updateCollegeController } from "../controllers/collegeController";
import { requireRole } from "../middleware/roleMiddleware";


const router = Router();

router.get("/", getColleges);
router.post("/" ,  requireRole("ADMIN"), createCollegeController);
router.get("/:id" , getCollege )
router.delete("/:id" , requireRole("ADMIN"), deleteCollegeController);
router.put("/:id" , requireRole("ADMIN"), updateCollegeController);

export default router;


