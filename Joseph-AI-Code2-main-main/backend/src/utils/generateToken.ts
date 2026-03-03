import { config } from "dotenv";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { StringValue } from "ms";

config();

const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) {   
    throw new Error("JWT_SECRET is not defined in environment variables");
}    

export const generateToken = (userId: string, resetToken: Boolean,  res?: Response, expiresIn?: number | StringValue) =>{
    const payload = {id:userId};
    const secretToSign = resetToken ? jwtSecret + userId : jwtSecret;
    const token = jwt.sign(payload, secretToSign, {expiresIn: expiresIn || "7d"});
    if (!resetToken) {
        res?.cookie("jwt", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
    return token
}