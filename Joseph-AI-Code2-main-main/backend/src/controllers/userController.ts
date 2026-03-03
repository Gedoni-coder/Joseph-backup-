import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { config } from "dotenv";
import bcrypt, { genSalt } from "bcryptjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { redis } from "../config/redis.ts";
import { generateToken } from "../utils/generateToken.ts";
import { createHash } from "crypto";
import { sendEmail } from "../config/nodemailer.ts";
import {
  oauthDeleteEmailBody,
  oauthDeleteEmailHtml,
  oauthDeleteSubject,
} from "../emails/oauthDeleteAccountEmail.ts";
import { cached, invalidate } from "../utils/cache.ts";

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const sbBucketName = process.env.SUPABASE_AVATAR_BUCKET_NAME;
const isDev = process.env.NODE_ENV !== "production";
const testEmail = process.env.TEST_EMAIL;
const host = process.env.HOST || "http://localhost:3001";
const base = process.env.BASE || "/api/v1";
const port = process.env.PORT || "3001";

if (!supabaseUrl || !supabaseKey || !sbBucketName || !isDev || !testEmail) {
  throw new Error("All variables not defined in environment variables");
}

const supabase = new SupabaseClient(supabaseUrl, supabaseKey);

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const user = await cached(`users:self:${req.userId}`, 7200, () =>
      prisma.user.findUnique({
        where: { id: req.userId as string },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          avatar_url: true,
          campus: true,
        },
      }),
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    // Whitelist fields
    const allowedFields = ["name", "bio", "avatar_url", "campus"];
    const updateData: any = {};

    await invalidate(`users:*:${req.userId}`);

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    updateData["updated_at"] = new Date(Date.now());

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.userId as string },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatar_url: true,
        campus: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deleteAuthenticatedUser = async (req: Request, res: Response) => {
  const { password } = req.body ?? {};
  const { token: verifyToken } = req.query ?? {};

  await invalidate(`users:*:${req.userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId as string },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // OAuth user - needs email verification
    if (user.google_id != null && user.password_hash == null) {
      const toEmail = isDev ? testEmail : user.email;

      const verifyToken = generateToken(user.id, true);
      const redisKey = `oauthDelete:${verifyToken}`;
      await redis.setEx(redisKey, 15 * 60, user.id);
      const link = `${host}:${port}${base}/user/deleteOauthUser?token=${verifyToken}`;

      const html = oauthDeleteEmailHtml.replace("{{DELETE_LINK}}", link);
      const subject = oauthDeleteSubject(user.name);
      const text = oauthDeleteEmailBody(link);

      await sendEmail({
        to: toEmail,
        subject,
        html,
        text,
      });

      return res.status(200).json({
        message:
          "A link to confirm your account deletion has been sent to your email",
      });
    }

    // Handle OAuth deletion with token verification
    if (verifyToken) {
      const isVerified = await verifyOauthDelete(verifyToken as string);
      if (isVerified && isVerified.userId === req.userId) {
        await prisma.user.delete({
          where: { id: req.userId as string },
        });
        await redis.del(isVerified.redisKey);

        return res
          .status(200)
          .cookie("jwt", "", { httpOnly: true, expires: new Date(0) })
          .json({ message: "User deleted successfully." });
      } else {
        return res
          .status(401)
          .json({ message: "Unauthorized or invalid token" });
      }
    }

    // Regular user - needs password verification
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!user.password_hash) {
      return res.status(400).json({ message: "Invalid account state" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await prisma.user.delete({
      where: { id: req.userId as string },
    });

    return res
      .status(200)
      .cookie("jwt", "", { httpOnly: true, expires: new Date(0) })
      .json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
const verifyOauthDelete = async (verifyToken: string) => {
  //get redis token
  const redisKey = `oauthDelete:${verifyToken}`;
  const userId = await redis.get(redisKey);
  if (!userId) {
    return null;
  }

  return { userId, redisKey };
};
export const uploadOrUpdateAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId as string },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate unique filename
    const fileExt = req.file.mimetype.split("/")[1];
    const fileName = `${sbBucketName}/${user.id}-${randomUUID()}.${fileExt}`;

    // Upload to storage
    const { error } = await supabase.storage
      .from(sbBucketName)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data } = supabase.storage.from(sbBucketName).getPublicUrl(fileName);

    // Delete old avatar (optional)
    if (user.avatar_url) {
      const oldPath = user.avatar_url.split(`/${sbBucketName}/`)[1];
      if (oldPath) {
        await supabase.storage.from(sbBucketName).remove([oldPath]);
      }
    }

    // Update DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar_url: data.publicUrl },
      select: {
        id: true,
        avatar_url: true,
      },
    });

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Upload failed" });
  }
};
export const findUserById = async (req: Request, res: Response) => {
  const id = String(req.params.id) ?? {};
  if (!id) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const user = await cached(`users:public:${id}`, 7200, () =>
      prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          phone: true,
          bio: true,
          avatar_url: true,
          campus: true,
        },
      }),
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUpdatePhone = async (req: Request, res: Response) => {
  try {
    const { newPhone } = req.body ?? {};
    const userId = req.userId as string;
    if (!newPhone) {
      return res.status(400).json({ message: "Enter your phone number" });
    }
    if (typeof newPhone !== "string" || newPhone.length < 8) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    // Hash OTP before storing
    const hashedOtp = createHash("sha256").update(otp).digest("hex");
    // Store hashed OTP in Redis with expiration (e.g., 10 minutes)
    const redisOtpKey = `phoneUpdateOtp:${userId}:${newPhone}`;
    await redis.setEx(redisOtpKey, 10 * 60, hashedOtp);

    //TODO: Send otp to user's phone number via SMS gateway (omitted for brevity)
    //add number to cookie or session for verification in updatePhone
    res.cookie("newPhone", newPhone, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 mins
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updatePhone = async (req: Request, res: Response) => {
  try {
    // Whitelist fields
    const { newPhone } = req.cookies ?? {};
    const userId = req.userId as string;
    const { otp } = req.body ?? {};

    //Invalidat all user contact listing
    await invalidate(`listing:${userId}:*`);
    
    if (!newPhone) {
      return res.status(400).json({ message: "invalid request" });
    }
    if (!otp) {
      return res
        .status(400)
        .json({ message: "Enter the OTP sent to your phone" });
    }

    //get otp from redis
    const redisOtpHit = await redis.get(`phoneUpdateOtp:${userId}:${newPhone}`);
    if (!redisOtpHit) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }
    const hashedIncoming = createHash("sha256").update(otp).digest("hex");
    if (hashedIncoming !== redisOtpHit) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (hashedIncoming === redisOtpHit) {
      const updateData: any = {};

      updateData["phone"] = newPhone;
      updateData["updated_at"] = new Date(Date.now());

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          avatar_url: true,
          campus: true,
        },
      });
      await redis.del(`phoneUpdateOtp:${userId}:${newPhone}`);
      res.clearCookie("phone");

      return res.status(200).json({
        message: "Phone updated successfully",
        user: updatedUser,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
