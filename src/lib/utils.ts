import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateTokenAndSetCookie = (
  id: string,
  res: Response
): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "12h",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 43200000,
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
