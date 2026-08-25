import type { Request, Response } from "express";
import { createMenuItem, deleteMenuItem, getMenuItemById, getMenuItems, updateMenuItem } from "../services/menuItemService";

export const createMenuItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menuItem = await createMenuItem(req.body);

    if (!menuItem) {
      res.status(400).json({
        success: false,
        message: "Invalid canteen or category"
      });

      return;
    }

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error("Error creating menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create menu item"
    });
  }
};


export const getMenuItemController = async(
    req: Request,
    res: Response
) : Promise<void> =>{
    try {
        const canteenId = typeof req.query.canteenId === "string" ?
        req.query.canteenId
        : undefined

        const categoryId = typeof req.query.categoryId === "string" ?
        req.query.categoryId
        : undefined

        const menuItems = await getMenuItems(
        canteenId,
        categoryId
        );

         res.status(200).json({
      success: true,
      data: menuItems
    });
} catch (error) {
    console.error("Error fetching menu items:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items"
    });
  }
};


export const getMenuItem = async(
    req: Request<{id: string}>,
    res: Response
) : Promise<void> =>{
    try {
        
        const menuItem = await getMenuItemById(req.params.id);
        if (!menuItem) {
            res.status(404).json({
                success: false,
                message: "Menu item not found"
            });

            return;
            }

            res.status(200).json({
            success: true,
            data: menuItem
            });
    } catch (error) {
        console.error("Error fetching menu item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch menu item"
        });
    }
};


export const updateMenuItemController  = async(
    req: Request<{id: string}>,
    res: Response
) : Promise<void> =>{
    try {
        const menuItem = await updateMenuItem(
      req.params.id,
      req.body
    );
 if (!menuItem) {
      res.status(404).json({
        success: false,
        message: "Menu item not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error("Error updating menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update menu item"
    });
  }
};

export const deleteMenuItemController = async(
    req:Request<{id:string}>,
    res:Response
): Promise<void> =>{
   try {
    const menuItem = await deleteMenuItem(req.params.id);

    if (!menuItem) {
      res.status(404).json({
        success: false,
        message: "Menu item not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item"
    });
  }
};