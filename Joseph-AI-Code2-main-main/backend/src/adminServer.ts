import express from "express";
import { connnectDB, disconnectDB } from "./admin/admin.db.ts";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import { adminMiddleware } from "./utils/adminOnly.ts";
import { authMiddleware } from "./utils/authMiddleware.ts";
import { createAdmin } from "./admin/adminController.ts";

config();
await connnectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//API Routes
const base = "/admin";

app.post(`${base}/createCategory`, authMiddleware, adminMiddleware);
app.get(`${base}/getCategories`, authMiddleware, adminMiddleware);

app.post(`${base}/createAdmin`, authMiddleware, adminMiddleware, createAdmin);

const port = process.env.ADMIN_PORT;
if (!port) {
  throw new Error("ADMIN_PORT not defined in environment variables");
}
app.listen(port, () => {
  console.log(`Admin server listening on port ${port}`);
});

// Gracefully handle shutdown
process.on("unhandledRejection", async (err: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  await disconnectDB();
  process.exit(1);
});
process.on("SIGTERM", async () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  await disconnectDB();
  process.exit(0);
});
process.on("uncaughtException", async (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  await disconnectDB();
  process.exit(1);
});
