import express from "express";
import {
  getAuthenticatedUser,
  updateAuthenticatedUser,
  deleteAuthenticatedUser,
  uploadOrUpdateAvatar,
  findUserById,
  getUpdatePhone,
  updatePhone,
} from "../controllers/userController.ts";
import { uploadSingleImage } from "../config/uploadImages.ts";
import { compressImages } from "../config/compressImages.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";
import { rateLimiter } from "../utils/rateLimiter.ts";
const router = express.Router();

// self routes
router.get("/me", authMiddleware, getAuthenticatedUser); //Returns authenticated user data.
router.put("/me", authMiddleware, updateAuthenticatedUser); //Updates authenticated user data.
router.delete("/me", authMiddleware, deleteAuthenticatedUser); //Deletes authenticated user account.
router.post(
  "/avatar",
  authMiddleware,
  uploadSingleImage("avatar"),
  compressImages,
  uploadOrUpdateAvatar
); //Uploads or updates user avatar image.
router.post(
  "/me/getUpdatePhone",
  authMiddleware,
  rateLimiter({ windowMs: 86_400_000, maxRequests: 3 }), // 3 per day
  getUpdatePhone
); //send otp to user phone number.
router.put("/me/updatePhone", authMiddleware, updatePhone); //Updates authenticated user phone number.
// other user routes
router.get("/:id", findUserById); //Find another user by their ID.

export default router;
