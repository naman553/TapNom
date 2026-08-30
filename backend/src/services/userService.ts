import bcrypt from "bcrypt";
import User from "../models/User";
import College from "../models/College";
import Canteen from "../models/Canteen";

export const createStaff = async(staffData: {
     name: string;
  email: string;
  password: string;
  collegeId: string;
  canteenId: string;
}) =>{
     const existingUser = await User.findOne({
    email: staffData.email
  });

    if (existingUser) {
    return null;
  }

    const college = await College.findById(
    staffData.collegeId
  );

    if (!college) {
    return null;
  }

  const canteen = await Canteen.findOne({
    _id: staffData.canteenId,
    collegeId: staffData.collegeId
  });

   if (!canteen) {
    return null;
  }


    const passwordHash = await bcrypt.hash(
    staffData.password,
    10
  );
return await User.create({
    name: staffData.name,
    email: staffData.email,
    passwordHash,
    role: "STAFF",
    collegeId: staffData.collegeId,
    canteenId: staffData.canteenId
  });
};