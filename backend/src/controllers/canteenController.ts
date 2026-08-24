import type { Request, Response } from "express";
import { createCanteen, deleteCanteen, getCanteenById, getCanteens, updateCanteen } from "../services/canteenService";
import Canteen from "../models/Canteen";

export const createCanteenController = async(
    req: Request,
    res: Response
): Promise<void> =>{
    try {
        const canteen = await createCanteen(req.body);

        if(!canteen){
             res.status(404).json({
        success: false,
        message: "College not found"
      });

      return;
        }

      res.status(201).json({
      success: true,
      data: canteen
    });
    } catch (error) {
         console.error("Error creating canteen:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create canteen"
    });
    }
}

export const getCanteensController = async(
    req: Request,
    res: Response
): Promise<void> =>{
    try {
        const collegeId =  typeof req.query.collegeId === "string" ? req.query.collegeId : undefined;

        const canteens = await getCanteens(collegeId);

      res.status(200).json({
      success: true,
      data: canteens
    });
  } catch (error) {
    console.error("Error fetching canteens:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteens"
    });
  }
};



export const getCanteen = async(
      req: Request<{ id: string }>,
  res: Response
  ): Promise<void> =>{
    try {
        const canteen = await getCanteenById(req.params.id);

         if (!canteen) {
      res.status(404).json({
        success: false,
        message: "Canteen not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: canteen
    });
    } catch (error) {
    console.error("Error fetching canteen:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch canteen"
    });
  }
  }


  export const updateCanteenController = async(
    req:Request<{id: string}>,
    res:Response
  ): Promise<void> =>{
    try {
        const canteen = await updateCanteen(req.params.id, req.body);

        if (!canteen) {
      res.status(404).json({
        success: false,
        message: "Canteen not found"
      });

      return;
    }


     res.status(200).json({
      success: true,
      data: canteen
    });

    } catch (error) {
    console.error("Error updating canteen:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update canteen"
    });
  }
};


export const deleteCanteenController = async(
    req:Request<{id:string}>,
    res:Response
) : Promise<void> =>{
    try {
        const canteen = await deleteCanteen(req.params.id);
    if (!canteen) {
      res.status(404).json({
        success: false,
        message: "Canteen not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Canteen deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting canteen:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete canteen"
    });
  }
};