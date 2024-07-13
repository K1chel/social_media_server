import * as z from "zod";

const MIN_PASSWORD_LENGTH = 6;

export const registerScehma = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    message: "Password must be at least 6 characters",
  }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});
