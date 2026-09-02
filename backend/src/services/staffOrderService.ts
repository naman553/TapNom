import Order from "../models/Order"
import { calculateEffectivePriority } from "./priorityService"

export const getStaffOrders = async(
    canteenId: string
)=> {
    const orders = await Order.find({
        canteenId,
        status: {
            $in : ["PLACED" , "ACCEPTED" , "PREPARING", "READY"]
        }

    })

    const ordersWithPriority = orders.map((order)=>{
        const waitingTimeMinutes = (Date.now() - order.createdAt.getTime())/60000;
        const effectivePriority = calculateEffectivePriority(order.basePriority, waitingTimeMinutes);


        return {
            order, 
            waitingTimeMinutes,
            effectivePriority
        };
    }) 

    ordersWithPriority.sort((a, b) => {
    if (b.effectivePriority !== a.effectivePriority) {
        return b.effectivePriority - a.effectivePriority;
    }

    return (
        a.order.createdAt.getTime() -
        b.order.createdAt.getTime()
    );
    });
    return ordersWithPriority;

}