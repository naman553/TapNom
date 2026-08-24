import { Request, Response } from "express";
import { getAllColleges , createCollege , getCollegeById , updateCollege ,deleteCollege } from "../services/collegeService";


export const getColleges = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const colleges = await getAllColleges();

    res.status(200).json({
      success: true,
      data: colleges
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch colleges"
    });
  }
};

export const createCollegeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const college = await createCollege(req.body);

    res.status(201).json({
      success: true,
      data: college
    });
  } catch (error) {
    console.error("Error creating college:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create college"
    });
  }
};

export const getCollege = async (
  req: Request<{id:string}>,
  res: Response
): Promise<void> => {
  try {
    const college = await getCollegeById(req.params.id);
    if(!college){
        res.status(404).json({
            success: false , 
            message: "College not found"
        }) 
        return 
    }
    res.status(200).json({
      success: true,
      data: college
    });
  } catch (error) {
    console.error("Error fetching college with id", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college with id"
    });
  }
};

export const deleteCollegeController = async (
  req: Request<{id:string}>,
  res: Response
): Promise<void> => {
  try {
    const college = await deleteCollege(req.params.id);
    if(!college){
        res.status(404).json({
            success: false , 
            message: "College not found"
        }) 
        return 
    }
    res.status(200).json({
      success: true,
      message : "College deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting college", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete college"
    });
  }
};

export const updateCollegeController = async (
  req: Request<{id:string}>,
  res: Response
): Promise<void> => {
  try {
    const college = await updateCollege(req.params.id , req.body);
    if(!college){
        res.status(404).json({
            success: false ,
            data : college, 
            message: "College not found"
        }) 
        return 
    }
    res.status(200).json({
      success: true,
      message : "College updated successfully",
    });
  } catch (error) {
    console.error("Error updating college", error);

    res.status(500).json({
      success: false,
      message: "Failed to update college"
    });
  }
};