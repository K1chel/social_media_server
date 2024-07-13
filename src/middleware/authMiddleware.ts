import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized, no token in cookies" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, token failed" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ error: "Unauthorized, user not found", decoded });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in protectedRoute: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
