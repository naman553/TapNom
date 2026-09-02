import Order from "../models/Order";

export const calculateETA = async (
  canteenId: string,
  currentOrderPreparationTime: number
): Promise<number> => {
  const waitingOrders = await Order.find({
    canteenId,
    status: {
      $in: ["PLACED", "ACCEPTED"]
    }
  });

  let waitingTime = 0;

  for (const order of waitingOrders) {
    for (const item of order.items) {
      waitingTime +=
        item.preparationTime * item.quantity;
    }
  }

  return waitingTime + currentOrderPreparationTime;
};