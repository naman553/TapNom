import Order from "../models/Order";

export const calculateETA = async (
  canteenId: string,
  currentOrderPreparationTime: number
): Promise<number> => {
  const waitingOrders = await Order.find({
    canteenId,
    status: {
      $in: ["PLACED", "ACCEPTED", "PREPARING"]
    }
  });

  let waitingTime = 0;

  for (const order of waitingOrders) {
    let orderPreparationTime = 0;

    for (const item of order.items) {
      orderPreparationTime +=
        item.preparationTime * item.quantity;
    }

    if (order.status === "PREPARING" && order.preparingAt) {
      const elapsedMinutes =
        (Date.now() - order.preparingAt.getTime()) / 60000;

      const remainingTime = Math.max(
        0,
        orderPreparationTime - elapsedMinutes
      );

      waitingTime += remainingTime;
    } else {
      waitingTime += orderPreparationTime;
    }
  }

  return waitingTime + currentOrderPreparationTime;
};