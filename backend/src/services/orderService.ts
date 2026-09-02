import mongoose from "mongoose";
import Order from "../models/Order";
import Payment from "../models/Payment";
import Canteen from "../models/Canteen";
import MenuItem from "../models/MenuItem";
import { getBasePriority } from "./priorityService";
import { generatePickupCredentials } from "./pickupService";
import { calculateETA } from "./etaService";
import razorpay from "../config/razorpay";

export const createOrder = async (
  userId: string,
  orderData: {
    canteenId: string;
    items: {
      menuItemId: string;
      quantity: number;
    }[];
    orderType: "NORMAL" | "EXPRESS";
    paymentMethod: "ONLINE" | "CASH";
    pickupSlot?: string;
  }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Validate canteen
    const canteen = await Canteen.findOne({
      _id: orderData.canteenId,
      isActive: true
    }).session(session);

    if (!canteen) {
      await session.abortTransaction();
      return null;
    }

    // 2. Validate that order contains items
    if (!orderData.items || orderData.items.length === 0) {
      await session.abortTransaction();
      return null;
    }

    // 3. Prevent duplicate menu items
    const menuItemIds = orderData.items.map(
      (item) => item.menuItemId
    );

    const uniqueMenuItemIds = new Set(menuItemIds);

    if (uniqueMenuItemIds.size !== menuItemIds.length) {
      await session.abortTransaction();
      return null;
    }

    // 4. Validate quantities
    for (const item of orderData.items) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        await session.abortTransaction();
        return null;
      }
    }

    // 5. Get menu items
    const menuItems = await MenuItem.find({
      _id: {
        $in: menuItemIds
      },
      canteenId: orderData.canteenId,
      isActive: true,
      isAvailable: true
    }).session(session);

   
    
    if (menuItems.length !== menuItemIds.length) {
      await session.abortTransaction();
      return null;
    }

 
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


    const totalAmount = orderItems.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

 const razorpayOrder = orderData.paymentMethod === "ONLINE"
  ? await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `tapnom_${Date.now()}`
    })
  : null;


    const basePriority = getBasePriority(
      orderData.orderType
    );


    const currentOrderPreparationTime =
      orderItems.reduce(
        (total, item) => {
          return (
            total +
            item.preparationTime *
              item.quantity
          );
        },
        0
      );


    const etaMinutes = await calculateETA(
      orderData.canteenId,
      currentOrderPreparationTime
    );

    const estimatedReadyAt = new Date(
      Date.now() +
        etaMinutes * 60 * 1000
    );

    
    const {
      qrToken,
      pickupPin,
      pickupPinHash
    } = await generatePickupCredentials();

    // 12. Create Order
    const createdOrders = await Order.create(
      [
        {
          userId,
          collegeId: canteen.collegeId,
          canteenId: orderData.canteenId,

          items: orderItems,

          totalAmount,

          orderType: orderData.orderType,
          basePriority,

          status: "PLACED",

          pickupSlot:
            orderData.pickupSlot,

          estimatedReadyAt,

          qrToken,
          qrGeneratedAt: new Date(),

          pickupPinHash,

          paymentStatus: "PENDING"
        }
      ],
      {
        session
      }
    );

    const createdOrder = createdOrders[0];


   const createdPayments = await Payment.create(
  [
    {
      orderId: createdOrder._id,
      userId,
      amount: totalAmount,
      method: orderData.paymentMethod,
      status: "PENDING",
      transactionId: "",

      razorpayOrderId:
        razorpayOrder?.id ?? "",

      razorpayPaymentId: ""
    }
  ],
  {
    session
  }
);

    const createdPayment =
      createdPayments[0];


    await session.commitTransaction();

  
   return {
  order: createdOrder,
  payment: createdPayment,
  pickupPin,
  razorpayOrder
};
  } catch (error) {

    await session.abortTransaction();

    throw error;
  } finally {
 
    session.endSession();
  }
};