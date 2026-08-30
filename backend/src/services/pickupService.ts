import bcrypt from "bcrypt";
import crypto from "crypto";

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