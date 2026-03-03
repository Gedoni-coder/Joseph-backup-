import express from "express";
import {
  register,
  login,
  logout,
  googleLogin,
  authFailure,
  forgotPassword,
  resetPassword,
  validateResetToken,
  verifyEmail,
} from "../controllers/authController.ts";
import passport from "passport";
import { authMiddleware } from "../utils/authMiddleware.ts";
import { rateLimiter } from "../utils/rateLimiter.ts";
const router = express.Router();

router.post("/register", register);
router.get("/verifyEmail", verifyEmail);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  googleLogin
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/failure", authFailure);
router.post(
  "/forgotpassword",
  rateLimiter({ windowMs: 30_000, maxRequests: 2 }),
  forgotPassword
);
router.get("/resetpassword", validateResetToken);
router.post("/resetpassword", resetPassword);

export default router;
