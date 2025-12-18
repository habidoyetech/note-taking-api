import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { registerSchema } from "../utils/validation";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "fail", message: error.details[0].message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    const savedUser = await user.save();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        userId: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      status: "error",
      message: "A database error occurred during registration.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The email address provided is not registered.",
      });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password. Please try again.",
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "Internal server error during login.",
    });
  }
};
