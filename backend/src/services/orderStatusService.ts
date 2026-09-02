import { error } from "node:console"
import Order from "../models/Order"

const allowedTransitions :Record<string , string[]> ={
    PLACED: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY"],
    READY: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: []
}

export const updateOrderStatus = async(
    orderId: string,
    canteenId: string,
    newStatus: string
) => {
    const order = await Order.findOne({
        _id : orderId,
        canteenId,

    })

    if(!order){
        return {
            error : "Order not found"
        }
    }

    if(!allowedTransitions[order.status]?.includes(newStatus)){
        return{
         error: `Cannot change status from ${order.status} to ${newStatus}`
        }
    }

    order.status = newStatus as typeof order.status ;
    const now = new Date() ;
    if (newStatus === "ACCEPTED") {
    order.acceptedAt = now;
  }

  if (newStatus === "PREPARING") {
    order.preparingAt = now;
  }

  if (newStatus === "READY") {
    order.readyAt = now;
  }

  if (newStatus === "COMPLETED") {
    order.completedAt = now;
  }

  await order.save();

  return {
    order
  };
};



