import express from "express";

import {
  logout,
  register,
  login,
  currentUser,
} from "../controllers/auth.controllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", authMiddleware, currentUser);

export default router;
