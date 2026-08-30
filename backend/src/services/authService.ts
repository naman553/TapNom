import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const registerStudent = async (
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    passwordHash,
    role: "STUDENT"
  });
};



export const logInUser = async(email: string, password: string) =>{
    const user = await User.findOne({email});

    if(!user) return null;
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordCorrect) return null;

     const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      canteenId: user.canteenId?.toString()
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d"
    }
  );

    return {user, token};
}