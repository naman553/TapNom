import type { Request, Response } from "express";
import { registerStudent, logInUser } from "../services/authService";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

      return;
    }

    const user = await registerStudent(email, password);

    if (!user) {
      res.status(409).json({
        success: false,
        message: "Email already registered"
      });

      return;
    }

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

      return;
    }

    const user = await logInUser(email, password);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: {
  token: user.token,
  user: {
    id: user.user._id,
    email: user.user.email,
    role: user.user.role
  }
}
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
};