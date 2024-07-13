import * as z from "zod";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { hashPassword, generateTokenAndSetCookie } from "../lib/utils";
import User from "../models/user.model";
import { registerScehma, loginSchema } from "../schemas/index";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerScehma.parse(req.body);

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    if (user) {
      const token = generateTokenAndSetCookie(user._id, res);

      res.status(201).json({
        message: "User created successfully",
        token,
        user,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Welcome back",
      token,
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
