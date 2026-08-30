import type { Request } from "express";
import Canteen from "../models/Canteen";
import Category from "../models/Category";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";

export const resolveCanteenId = async (
  req: Request
): Promise<string | null> => {
  const canteen = await Canteen.findById(req.params.id);

  return canteen ? canteen._id.toString() : null;
};

export const resolveCategoryCanteenId = async (
  req: Request
): Promise<string | null> => {
  const category = await Category.findById(req.params.id);

  return category ? category.canteenId.toString() : null;
};

export const resolveMenuItemCanteenId = async (
  req: Request
): Promise<string | null> => {
  const menuItem = await MenuItem.findById(req.params.id);

  return menuItem ? menuItem.canteenId.toString() : null;
};

export const resolveOrderCanteenId = async (
  req: Request
): Promise<string | null> => {
  const order = await Order.findById(req.params.id);

  return order ? order.canteenId.toString() : null;
};

export const resolveBodyCanteenId = async (
  req: Request
): Promise<string | null> => {
  const canteenId = req.body.canteenId;

  if (typeof canteenId !== "string") {
    return null;
  }

  const canteen = await Canteen.findById(canteenId);

  return canteen ? canteen._id.toString() : null;
};