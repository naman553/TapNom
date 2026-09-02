import bcrypt from "bcrypt";
import crypto from "crypto";
import Order from "../models/Order";

export const generatePickupCredentials = async() =>{
    const qrToken = crypto.randomBytes(32).toString("hex");

    const pickupPin = crypto.randomInt(100000, 1000000).toString();

    const pickupPinHash = await bcrypt.hash(pickupPin, 10);


    return{
        qrToken,
        pickupPin,
        pickupPinHash
    }

    
}

export const verifyPickupPin = async(
    orderId: string,
    canteenId : string,
    pickupPin : string
)=> {
    const order = await Order.findOne({
        _id : orderId,
        canteenId
    }).select("+pickupPinHash")

    if(!order){
        return {
            error : "Order not found"
        }
    }

    if(order.status !== "READY"){
        return {
            error : "Order is not ready for pickup"
        }
    }

    if(!order.pickupPinHash){
        return {
            error : "Pickup Pin not available"
        }
    }

    const isValid = await bcrypt.compare(pickupPin, order.pickupPinHash)

    if(!isValid){
        return {
            error : "Pickup Pin is invalid"
        }
    }

    order.status = "COMPLETED"
    order.completedAt = new Date();
    order.pickupVerifiedAt = new Date();
    order.pickupVerificationMethod = "PIN"
    await order.save()

    return {
        order 
    }

}

export const verifyPickupQR = async(
    qrToken : string,
    canteenId : string
)=>{
    const order =await Order.findOne({
        qrToken,
        canteenId
    })

    if(!order){
        return {error : "Invalid QR code"}
    }

    if(order.status !== "READY"){
        return {
            error : "Order is not ready"
        }
    }

    order.status = "COMPLETED"
    order.completedAt = new Date();
    order.pickupVerifiedAt = new Date();
    order.pickupVerificationMethod = "QR"
    await order.save()

    return {
        order 
    }

}