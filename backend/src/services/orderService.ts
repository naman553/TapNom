import Canteen from "../models/Canteen";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import { getBasePriority } from "./priorityService";

export const createOrder = async (
    userId : string,
    orderData : {
        canteenId : string;
        items : {
            menuItemId : string,
            quantity : number
        }[];
        orderType : "NORMAL" | "EXPRESS",
        pickUpSlot? : string

    }
) => {const canteen = await Canteen.findOne({
    _id: orderData.canteenId,
    isActive : true

})

if(!canteen) return null ;

const menuItems = await MenuItem.find(
    {
        _id:{
            $in: orderData.items.map(item => item.menuItemId )
        }, 
        canteenId : orderData.canteenId,
        isActive : true,
        isAvailable: true
    }
)

if(menuItems.length !== orderData.items.length  ) return null ;


const orderItems = orderData.items.map((item ) => {
    const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === item.menuItemId)
    return {
        menuItemId : menuItem!._id,
        name : menuItem!.name,
        price : menuItem!.price,
        quantity : item.quantity
        
    };
} )

const totalAmount = orderItems.reduce(
    (total , item) => {
        return total + item.price*item.quantity 
    },
    0
)

const basePriority = getBasePriority(orderData.orderType);

const order = await Order.create({
    userId,
    collegeId : canteen.collegeId,
    canteenId : orderData.canteenId,
    items : orderItems,
    totalAmount,
    orderType : orderData.orderType,
    basePriority,
    pickupSlot: orderData.pickUpSlot 
}) 



return order ;




}