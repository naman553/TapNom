import Order from "../models/Order";
import Canteen from "../models/Canteen";
import MenuItem from "../models/MenuItem";
import { getBasePriority } from "./priorityService";
import { generatePickupCredentials } from "./pickupService";
import { calculateETA } from "./etaService";

export const createOrder = async (
  userId: string,
  orderData: {
    canteenId: string;
    items: {
      menuItemId: string;
      quantity: number;
    }[];
    orderType: "NORMAL" | "EXPRESS";
    pickupSlot?: string;
  }
) => {
  // 1. Check whether the canteen exists and is active
  const canteen = await Canteen.findOne({
    _id: orderData.canteenId,
    isActive: true
  });

  if (!canteen) {
    return null;
  }

  // 2. Get all requested menu items
  const menuItems = await MenuItem.find({
    _id: {
      $in: orderData.items.map((item) => item.menuItemId)
    },
    canteenId: orderData.canteenId,
    isActive: true,
    isAvailable: true
  });

  // 3. Make sure every requested item was found
  if (menuItems.length !== orderData.items.length) {
    return null;
  }

  // 4. Create order item snapshots
  const orderItems = orderData.items.map((item) => {
    const menuItem = menuItems.find(
      (menuItem) =>
        menuItem._id.toString() === item.menuItemId
    );

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      preparationTime: menuItem.preparationTime
    };
  });

  // 5. Calculate food subtotal
  const totalAmount = orderItems.reduce(
    (total, item) => {
      return total + item.price * item.quantity;
    },
    0
  );

  // 6. Determine initial priority
  const basePriority = getBasePriority(
    orderData.orderType
  );

  // 7. Calculate current order preparation time
  const currentOrderPreparationTime = orderItems.reduce(
    (total, item) => {
      return (
        total +
        item.preparationTime * item.quantity
      );
    },
    0
  );

  // 8. Calculate ETA
  const etaMinutes = await calculateETA(
    orderData.canteenId,
    currentOrderPreparationTime
  );

  const estimatedReadyAt = new Date(
    Date.now() + etaMinutes * 60 * 1000
  );

  // 9. Generate QR + PIN
  const {
    qrToken,
    pickupPin,
    pickupPinHash
  } = await generatePickupCredentials();

  // 10. Create order
  const order = await Order.create({
    userId,
    collegeId: canteen.collegeId,
    canteenId: orderData.canteenId,
    items: orderItems,
    totalAmount,
    orderType: orderData.orderType,
    basePriority,
    status: "PLACED",
    pickupSlot: orderData.pickupSlot,
    estimatedReadyAt,
    qrToken,
    qrGeneratedAt: new Date(),
    pickupPinHash,
    paymentStatus: "PENDING"
  });

  // 11. Return order + raw PIN
  return {
    order,
    pickupPin
  };
};