import { Router } from "express";
import { getColleges, createCollegeController, getCollege ,deleteCollegeController ,updateCollegeController } from "../controllers/collegeController";


const router = Router();

router.get("/", getColleges);
router.post("/" , createCollegeController);
router.get("/:id" , getCollege )
router.delete("/:id" , deleteCollegeController);
router.put("/:id" , updateCollegeController);

export default router;


