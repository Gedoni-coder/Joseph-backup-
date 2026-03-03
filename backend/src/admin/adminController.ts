import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { adminPrisma } from "./admin.db.ts";
import { generateToken } from "../utils/generateToken.ts";


export const createAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email and password" });
  }

  // check if user already exists
  const userExists = await adminPrisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // create user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await adminPrisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
      role: "ADMIN",
    },
  });
  const token = generateToken(newUser.id, false, res);

  return res.status(201).json({
    message: "User registered successfully",
    userId: newUser.id,
    token,
  });
};
