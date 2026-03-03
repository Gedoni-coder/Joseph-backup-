import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.ts";
import { config } from "dotenv";
import crypto from "crypto";
import { redis } from "../config/redis.ts";
import { sendEmail } from "../config/nodemailer.ts";
import {
  emailBody,
  subject,
  verificationEmailHtml,
} from "../emails/emailVerification.ts";
import {
  forgotPasswordEmailHtml,
  forgotPasswordSubject,
  forgotPasswordText,
} from "../emails/forgotPasswordEmail.ts";
config();

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const jwtSecret = process.env.JWT_SECRET;
const host = process.env.HOST || "http://localhost:3001";
const base = process.env.BASE || "/api/v1";
const port = process.env.PORT || "3001";
// Standardize NODE_ENV values: development, production, test
const isDev = process.env.NODE_ENV !== "production";
const testEmail = process.env.TEST_EMAIL;

if (!jwtSecret || !isDev || !testEmail) {
  throw new Error(
    "JWT_SECRET, or NODE_ENV, or TEST_EMAIL is not defined in environment variables"
  );
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email and password" });
  }

  // check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // create user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
  });

  const verificationLink = await getVerifyEmail(newUser.id);

  const toEmail = isDev ? testEmail : newUser.email;
  await sendEmail({
    to: toEmail,
    subject: subject(newUser.name),
    text: emailBody(verificationLink),
    html: verificationEmailHtml.replace(
      "{{VERIFICATION_LINK}}",
      verificationLink
    ),
  });

  return res.status(201).json({
    message: "A link has been sent to your email to verify your account.",
  });
};

export const getVerifyEmail = async (userId: string) => {
  const verifyToken = generateToken(userId, true);
  await redis.setEx(`emailVerify:${verifyToken}`, 15 * 60, userId);
  const verifyLink = `${host}:${port}${base}/auth/verifyEmail?token=${verifyToken}`;
  return verifyLink;
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token: verifyToken } = req.query ?? {};

  if (!verifyToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    //get redis token
    const redisKey = `emailVerify:${verifyToken}`;
    const redisHit = await redis.get(redisKey);
    if (!redisHit) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const updateData: any = {};
    updateData["email_verified"] = true;
    if (redisHit) {
      const verifiedUser = await prisma.user.update({
        where: { id: redisHit },
        data: updateData,
      });
      await redis.del(redisKey);

      return res.status(200).json({
        msg: "User email verified successfully",
        user: verifiedUser.email_verified,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email } = req.body ?? {};
  const { password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  // find user by email
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user?.password_hash === null) {
    return res.status(400).json({ message: "Please login with Google OAuth" });
  }
  // compare password
  if (user.password_hash) {
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }
  if (!user.email_verified) {
    const verifyLink = await getVerifyEmail(user.id);
    return res.status(403).json({
      message: "Email not verified",
      link: verifyLink,
    });
  }
  // return jwt
  const token = generateToken(user.id, false, res);
  return res
    .status(200)
    .json({ message: "Login successful", userId: user.id, token });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logout successful" });
};
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.user as any;
  res
    .cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({ message: "Google Login successful" });
};

export const authFailure = async (req: Request, res: Response) => {
  res.status(401).json({ message: " Google Authentication Failed" });
};

//password reset controllers
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }
  try {
    //find user
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(200).json(
        { message: "If an account exists, a password reset link has been sent" }
      );
    }

    //user exists so create one time link valid for 15min
    const token = generateToken(user.id, true, res, "15m");
    const link = `${host}${req.baseUrl}/resetpassword?token=${token}`;

    await redis.setEx(`reset:${token}`, 15 * 60, user.id);

    const html = forgotPasswordEmailHtml.replace("{{RESET_LINK}}", link);

    const toEmail = isDev ? testEmail : user.email;
    await sendEmail({
      to: toEmail,
      subject: forgotPasswordSubject(user.name),
      html: html,
      text: forgotPasswordText(link),
    });
    return res.status(200).json({
      message: "If an account exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("something went wrong:", error);
  }
};
export const validateResetToken = async (req: Request, res: Response) => {
  const { token } = req.query ?? {};

  if (!token) {
    return res.status(400).json({ message: "No token parsed" });
  }
  try {
    const redisKey = `reset:${token}`;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token valid" });
  } catch (error) {
    console.error("Error validating reset token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query ?? {};
  const { password } = req.body ?? {};

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (!token) {
    return res.status(400).json({ message: "No token parsed" });
  }
  const redisKey = `reset:${token}`;
  try {
    const userId = await redis.get(redisKey);
    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
      },
    });

    await redis.del(redisKey);
    res
      .cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired reset link" });
  }
};
