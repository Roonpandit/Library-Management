import { Request, Response } from "express";
import User from "../models/User";
import { validate, userSchema, loginSchema } from "../utils/validation";
import { generateToken } from "../utils/jwtUtils";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, userSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const { name, email, password, role } = data as any;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { valid, data, errors } = validate(req.body, loginSchema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const { email, password } = data as any;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({
          message:
            "Your account has been blocked. Please contact admin for assistance.",
        });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        notifications: user.notifications,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
