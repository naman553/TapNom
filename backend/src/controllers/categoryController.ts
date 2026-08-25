import { Request, Response } from "express";
import { createCategory, deleteCategory, getCategorises, getCategoryById, updateCategory } from "../services/categoryService";

export const createCategoryController = async (
    req : Request,
    res : Response
): Promise<void> =>{
    try {
        const category = await createCategory(req.body);

        if(!category){
            res.status(404).json({
                success : false,
                message : "Canteen not found"
            });
            return ;
        }

        res.status(201).json({
            success:true,
            data: category
        });

    } catch (error) {
        console.log("Error creating category: " , error);
        res.status(500).json({
            success:false,
            message : "Failed to create category"
        });
    }
};

export const getCategorieController = async(
    req : Request,
    res : Response
):Promise<void> =>{
    try{
        const canteenId = 
        typeof req.query.canteenId === 'string'
        ? req.query.canteenId
        : undefined ;
        const categories = await getCategorises(canteenId);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};

export const getCategory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error("Error fetching category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category"
    });
  }
};

export const updateCategoryController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const category = await updateCategory (
      req.params.id,
      req.body
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error("Error updating category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category"
    });
  }
};

export const deleteCategoryController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const category = await deleteCategory (req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};